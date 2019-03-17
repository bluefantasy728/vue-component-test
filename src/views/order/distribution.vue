<template>
  <div class="page">
    <el-form class="cell-list" label-position="top">
      <el-form-item class="cell title" label="选择上门的师傅"></el-form-item>
      <el-form-item class="avatar-list" v-if="workerList.length">
        <label
          :class="{checked:checkedWorkers.indexOf(worker.userId)>=0}"
          class="avatar-item"
          v-for="(worker,index) in workerList"
          :key="index"
        >
          <input @change="distribution(worker.userId)" type="checkbox">
          <span class="avatar-img"></span>
          <div class="profile">
            <span class="bold">{{worker.userName}}</span>
            <span class="desc line1">工号 {{worker.workerCode}}</span>
          </div>
        </label>
      </el-form-item>
    </el-form>
    <div class="cell-list choose-date">
      <div class="time">
        <span class="cell title">预计上门时间</span>
        <span class="line1">{{ doorTime}}</span>
      </div>
      <el-date-picker
        popper-class="date-picker-popper"
        class="date-picker el-icon-date"
        type="datetime"
        :editable="false"
        v-model="doorTime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间"
      ></el-date-picker>
    </div>
    <el-button class="btn-primary" @click="toDistribution">分配</el-button>
  </div>
</template> 

<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  background: #f6f6f6;
  padding: 14px 16px;
}
.cell.title {
  color: #9b9b9b;
}
.avatar-list {
  padding: 16px 0;
  /deep/ .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
.avatar-item {
  flex: 50% 0 0;
  height: 72px;
  display: flex;
  align-items: center;
  position: relative;
  &::after {
    content: '\e61c';
    color: #9b9b9b;
    font-family: 'iconfont' !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    left: 24px;
    top: 28px;
    font-size: 20px;
  }
  &.checked::after {
    color: $primary;
  }
  input {
    display: none;
  }
  .profile {
    display: flex;
    padding-left: 12px;
    flex-direction: column;
    justify-content: center;
  }
}
/deep/ .choose-date {
  height: 80px;
  display: flex;
  align-items: center;
  position: relative;
  .time {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    .cell {
      height: auto;
      line-height: 1.6;
      border: 0;
    }
  }

  .date-picker {
    position: absolute;
    right: 50px;
    top: 20px;
    height: 100%;
    width: auto;
    &::before {
      font-size: 30px;
      position: absolute;
      left: 10px;
      top: 5px;
    }
    * {
      display: none;
    }
    .el-input__inner {
      border: 0;
      width: 30px;
      height: 30px;
      padding: 20px 25px;
      display: block;
      position: absolute;
      background-color: transparent;
      border-left: 1px solid #f1f1f1;
    }
  }
}
.btn-primary {
  margin-top: 20px;
}
</style>
<script>
import { getAllWorker, updateOrderInfo } from '@/api/api';
export default {
  components: {},
  computed: {
    workerIds() {
      return this.checkedWorkers.join(';');
    },
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      version: this.$route.query.version,
      doorTime: '',
      workerList: [],
      checkedWorkers: [],
    };
  },
  mounted() {
    this.queryMaster();
  },
  methods: {
    async queryMaster() {
      const res = await getAllWorker();
      console.log(res);
      if (res.success && res.status === '200') {
        this.workerList = res.data;
      }
    },
    async toDistribution() {
      if (this.checkedWorkers.length === 0) {
        this.$message.error('请选择至少一位师傅！');
        return;
      }
      if (this.doorTime === '') {
        this.$message.error('请选择预计上门时间！');
        return;
      }
      const res = await updateOrderInfo({
        urlSuffix: `/${this.orderId}`,
        params: {
          version: this.version,
          orderStatus: '5',
          maintainerId: this.workerIds,
          expectedArrivalTime: this.doorTime,
        },
      });

      if (res.success && res.status === '200') {
        this.$message.success('分配成功！');
        setTimeout(() => {
          this.$router.push({
            name: 'order-detail',
            params: {
              orderId: this.orderId,
            },
          });
        }, 1000);
      }
    },
    async distribution(id) {
      console.log(this.checkedWorkers.includes(id));
      const index = this.checkedWorkers.indexOf(id);
      // // 暂时只能选一个师傅
      // this.checkedWorkers = [id];

      // 多选情况
      if (index < 0) {
        this.checkedWorkers.push(id);
      } else {
        this.checkedWorkers.splice(index, 1);
      }

      // console.log(this.checkedWorkers);
      // console.log(JSON.parse(JSON.stringify(workerList)));
    },
    // change(val) {
    //   console.log(val);
    //   this.doorTime = val;
    // },
  },
};
</script>
