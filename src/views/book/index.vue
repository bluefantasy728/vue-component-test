<template>
  <div class="page">
    <div class="circle"></div>
    <p class="address">
      <!-- <span class="iconfont icon-icon_yuyue"></span> -->
      <!-- {{address}} -->
    </p>
    <p class="choose-title">选择维修类目</p>
    <ul class="repair-list">
      <li
        v-for="item in itemList"
        :key="item.repairId"
        :itemList="itemList"
        :class="iconMap[item.repairId]"
        class="repair-item iconfont"
        @click="toLevel2(item)"
      >
        <span>{{item.repairName}}</span>
      </li>
      <!-- <router-link
        v-for="item in itemList"
        
        :to="{name: 'book-items', query: {repairId: item.repairId}}"
        :class="iconMap[item.repairId]"
        class="repair-item iconfont"
      >{{ item.repairName }}</router-link>-->
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  // background-image: radial-gradient(
  //   352px circle at center -140px,
  //   $primary-black 100%,
  //   #fff
  // );
  overflow: hidden;
  position: relative;
  .circle {
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: #020224;
    position: absolute;
    z-index: 0;
    top: -600px;
    left: 50%;
    transform: translateX(-50%);
  }
  background-color: #f6f6f6;
  .iconfont {
    position: relative;
    &::before {
      font-size: 70px;
      color: #e8e9e9;
      position: absolute;
      z-index: 1;
      left: 0;
      top: 50%;
    }
    &:nth-child(1)::before {
      transform: translate(0, -50%);
    }
    &:nth-child(2)::before {
      transform: translate(-24%, -50%);
    }
    &:nth-child(3)::before {
      transform: translate(-40%, -50%);
    }
    &:nth-child(4)::before {
      transform: translate(-40%, -50%);
    }
    &:nth-child(5)::before {
      transform: translate(-40%, -50%);
    }
    &:nth-child(6)::before {
      transform: translate(-20%, -50%);
    }
  }
  .address {
    display: flex;
    padding-left: 60px;
    padding-top: 28px;
    color: #ecf0f5;
    font-size: 12px;
    font-family: $font-md;
    font-weight: 100;
    align-items: center;
    // line-height: 14px;
    &::before {
      font-size: 26px;
      left: 34px;
      top: 35px;
    }
    .circle {
      margin-right: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      @include border-1px(#dedede);
    }
  }
  .choose-title {
    padding-left: 37px;
    color: #fff;
    font-family: SourceHanSansCN-Light;
    font-weight: 100;
    font-size: 35px;
    padding-top: 22px;
    position: relative;
  }
  .repair-list {
    padding: 0 32px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    margin-top: 27px;
    justify-content: space-between;
    .repair-item {
      flex-basis: 148px;
      display: flex;
      height: 113px;
      line-height: 1.4;
      color: #2b2b2b;
      font-size: 16px;
      font-family: $font-md;
      position: relative;
      z-index: 0;
      box-sizing: border-box;
      overflow: hidden;
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 14px;
      background-color: #fff;
      box-shadow: 0px 5px 11px 0px rgba(182, 182, 182, 0.5);
      justify-content: flex-end;
      align-items: flex-end;
      text-align: right;
      span {
        position: relative;
        z-index: 2;
      }
      &::after {
        content: ' ';
        width: 40px;
        height: 40px;
        background-color: #fcec0c;
        position: absolute;
        right: 0;
        bottom: 0;
        transform: translate(40%, 58%);
        border-radius: 50%;
      }
    }
  }
}
</style>

<script>
import Cookies from 'js-cookie';
import { queryRepairCategoryList, queryWorkerAppraises } from '@/api/api';
import { authorize } from '@/utils/authorize';
export default {
  components: {},
  data() {
    return {
      parentId: '0',
      orders: [],
    };
  },
  computed: {
    address() {
      return this.orders.length
        ? this.orders[0].address + this.orders[0].detailAddress
        : '';
    },
  },
  watch: {},
  methods: {
    async queryMatainProjects() {
      return await queryRepairCategoryList({
        urlSuffix: `/${this.parentId}`,
      });
    },

    toLevel2(item) {
      this.$storage.set('STARSERVICE_LEVEL1', item.repairName);
      this.$router.push({
        name: 'book-items',
        query: { repairId: item.repairId },
      });
    },
  },
  async created() {
    const res = await this.queryMatainProjects();
    if (res.success) {
      this.setItemList(res.data);
      console.log(res.data);
    }
    console.log(JSON.parse(JSON.stringify(res)));
  },
};
</script>
