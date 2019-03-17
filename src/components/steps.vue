<template>
  <div class="steps">
    <el-steps space="66px" direction="vertical" finish-status="wait" :active="index">
      <template v-for="(item, idx) in stepReverse">
        <el-step :key="idx" :description="item.operationDate" :title="item.descriptionDetail"></el-step>
        <div
          class="popoverList"
          v-if="item.showAvatar"
          :key="idx"
          :style="`top:${idx * 66 + 14}px`"
        >
          <el-popover
            v-for="(item2, idx2) in item.flowLogOrderUserVos"
            :key="idx2 + 'popover'"
            popper-class="tel-popover"
            placement="bottom"
            class="avatar-item"
            trigger="click"
          >
            <div slot="reference" class="avatar-img"></div>
            <div class="call-tel">
              <div class="profile">
                <span class="bold">{{item2.workerName}}</span>
                <span class="desc line1">{{item2.workerCode}}</span>
              </div>
              <a :href="'tel:'+item2.workerMob" class="iconfont icon-icon_mobile"></a>
            </div>
          </el-popover>
        </div>
      </template>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    stepsList: {
      type: Array,
      deafult: () => [],
    },
    active: {
      type: Number,
    },
  },
  computed: {
    index() {
      return this.active ? this.active : this.stepsList.length - 1;
    },
    stepReverse() {
      return this.stepsList.reverse();
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import '@/scss/variables.scss';

.steps /deep/ {
  position: relative;
  .el-step__head {
    width: 15px;
    transform: translateY(5px);
    &.is-process {
      transform: translateY(0px);
      .el-step__icon {
        width: 15px;
        height: 15px;
        background-color: $primary;
        border: 1px solid rgba(170, 170, 255, 1);
      }
    }
    .el-step__icon {
      display: block;
      margin: 0 auto;
      border: 0;
      width: 7px;
      height: 7px;
      background-color: #d2d2d6;
      .el-step__icon-inner {
        display: none;
      }
    }
    .el-step__line {
      left: 7px;
      background-color: #d2d2d6;
    }
  }
  .el-step__main {
    color: $primary;
    .el-step__title {
      font-size: 14px;
      line-height: 18px;
    }
    .el-step__description {
      font-size: 12px;
      line-height: 12px;
    }
    .is-process.el-step__title,
    .is-process.el-step__description {
      color: $primary;
    }
  }
  .popoverList {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    right: 0;
  }
  .avatar-item {
    margin-left: 4px;
  }
}
</style>
