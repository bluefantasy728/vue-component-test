<template>
  <div class="page">
    <el-form class="cell-list" label-position="left">
      <el-form-item class="cell" label="姓名">
        <span @click="dialog('姓名','userName','input')">{{ formData.userName || '未设置' }}</span>
      </el-form-item>
      <el-form-item class="cell" label="称谓">
        <span @click="dialog('称谓','userSex','select')">
          <span v-if="formData.userSex == 'M'">{{ '先生' }}</span>
          <span v-if="formData.userSex == 'W'">{{ '女士' }}</span>
          <span v-if="formData.userSex == 'X' || !formData.userSex">{{ '未设置' }}</span>
        </span>
      </el-form-item>
      <el-form-item class="cell" label="公司">
        <span @click="dialog('公司','userCompany','input')">{{ formData.userCompany || '未设置' }}</span>
      </el-form-item>
      <el-form-item class="cell" label="地区">
        <span @click="dialog('地区','userRegion')">
          {{ formData.userRegion || '未设置' }}
          <!-- <i class="el-icon-arrow-right"></i> -->
        </span>
      </el-form-item>
      <el-form-item class="cell" label="地址">
        <span @click="dialog('地址','userAddress','input')">{{ formData.userAddress || '未设置' }}</span>
      </el-form-item>

      <el-button class="btn-primary" @click="saveUser">保存</el-button>
      <el-button class="btn-primary cancel" @click="logout">解绑</el-button>
    </el-form>
    <infoDialog ref="xxx" @goBack="back"></infoDialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  .cell-list {
    padding: 10px 32px 0;
    /deep/ .el-form-item__content {
      color: #9b9b9b;
      padding-right: 20px;
      .el-icon-arrow-right {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .btn-primary {
      &:first-of-type {
        margin-top: 40px;
        margin-bottom: 10px;
      }
      &.cancel {
        margin: 0;
      }
    }
  }
}
</style>

<script>
import { logOut, userInfo } from '@/api/api';
import infoDialog from '@/components/infoDialog';
import { TOKEN_EXPIRES } from '@/config';
import Cookies from 'js-cookie';

export default {
  components: { infoDialog },
  beforeRouteEnter(to, from, next) {
    next();
  },
  data() {
    return {
      formData: {
        userName: '',
        userSex: '',
        userCompany: '',
        userRegion: '',
        userAddress: '',
      },
    };
  },
  computed: {},
  mounted() {
    this.setUser();
  },
  methods: {
    setUser() {
      Object.keys(this.formData).map(item => {
        this.formData[item] = this.user[item];
      });
    },
    back(msg) {
      this.formData[msg.key] = msg.value;
    },
    dialog(title, key, type) {
      this.$refs.xxx.dialogTableVisible = true;
      this.$refs.xxx.title = title;
      this.$refs.xxx.key = key;
      this.$refs.xxx.type = type;
    },
    inputInfo(key, name) {
      this.$prompt('', `修改${name}`, {
        customClass: 'input-box',
        showCancelButton: false,
        confirmButtonClass: 'btn-inline',
        confirmButtonText: '确认修改',
        inputPlaceholder: `请输入${name}`,
      })
        .then(r => {
          r.value && (this.formData[key] = r.value);
        })
        .catch(err => {});
    },
    async saveUser() {
      this.formData.userSex =
        this.formData.userSex == '' ? 'X' : this.formData.userSex;
      const res = await userInfo({
        params: {
          ...this.formData,
          userId: this.user.userId,
        },
      });
      if (res.success) {
        Cookies.set('user', res.data, { expires: TOKEN_EXPIRES });
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      }
    },
    async logout() {
      const res = await logOut();
      if (res.success && res.status === '200') {
        Cookies.remove('token');
        Cookies.remove('user');
        this.$message.success('解绑成功！');
        this.$router.replace({
          name: 'book',
        });
      } else {
        this.$message.error('解绑失败！');
      }
    },
  },
};
</script>
