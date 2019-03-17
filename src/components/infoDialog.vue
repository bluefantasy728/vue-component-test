<template>
  <div class>
    <el-dialog :title="`修改${title}`" :visible.sync="dialogTableVisible" center>
      <el-input v-if="type == 'input'" v-model="value" placeholder="请输入内容"></el-input>
      <el-select v-if="type == 'select'" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-cascader
        v-if="key == 'userRegion'"
        :options="region"
        separator="-"
        @active-item-change="handleItemChange"
        @change="areaChange"
        :props="props"
      ></el-cascader>
      <el-button class="el-button--primary btn-inline" @click="confirm">确认修改</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getRegion, getProvince } from '@/api/api';

export default {
  name: '',
  data() {
    return {
      dialogTableVisible: false,
      title: '233',
      key: '',
      type: '',
      value: '',
      region: [],
      props: {
        label: 'label',
        value: 'value',
        children: 'cities',
      },
    };
  },
  components: {},
  computed: {
    options() {
      if (this.key == 'userSex') {
        return [
          {
            label: '先生',
            value: 'M',
          },
          {
            label: '女士',
            value: 'W',
          },
        ];
      }
    },
  },
  mounted() {
    this.allRegion();
  },
  methods: {
    confirm() {
      this.$emit('goBack', { key: this.key, value: this.value });
      this.dialogTableVisible = false;
      this.value = '';
    },
    async allRegion() {
      const res = await getRegion();
      console.log(res);
      res.data.map(item => {
        this.region.push({
          label: item.regionName,
          value: item.regionCode,
          cities: [],
        });
      });
    },
    async selectProvince(val) {
      const res = await getProvince({
        params: {
          regionCode: val,
        },
      });
      console.log(res);
      this.region.map(item => {
        if (item.value == val) {
          res.data.map(item2 => {
            item.cities.push({
              label: item2.province,
              value: item2.code,
            });
          });
        }
      });
      // res.data.map(item => {
      //   this.region.push({
      //     label: item.regionName,
      //     value: item.regionCode,
      //     cities: [],
      //   });
      // });
    },
    handleItemChange(val) {
      console.log(val);
      this.selectProvince(Number(val));
    },
    areaChange(val) {
      console.log(val);
      this.region.map(item => {
        if (val[0] == item.value) {
          item.cities.map(item2 => {
            if (val[1] == item2.value) {
              this.value = `${item.label}-${item2.label}`;
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  width: 270px;
  border-radius: 6px;
  background: rgba(254, 254, 254, 1);
  box-shadow: 0px 2px 14px 0px rgba(240, 240, 240, 0.5);
  .el-dialog__title {
    font-size: 16px;
    color: #2b2b2b;
    font-family: PingFangSC-Medium;
  }
  .el-dialog__body {
    padding: 10px 24px 16px !important;
  }
  .el-input {
    // @include border-1px(#dedede, bottom);
    border-bottom: 1px solid #dedede;
  }
  .el-input__inner {
    border: 0;
  }
  .btn-inline {
    margin: 14px auto 0;
    display: block;
  }
}
</style>
