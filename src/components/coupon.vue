<template>
  <div>
    <!-- <div class="coupon iconfont icon-icon_about">
      <div class="coupon-name">首单减免费</div>
      <div class="coupon-price">
        <span class="currency">￥</span>50
      </div>
      <p class="desc coupon-desc">使用期限: 2018-10-01 至 2019-02-01</p>
      <router-link
        v-if="detailShow"
        :to="{name: 'coupons-detail'}"
        tag="p"
        class="desc coupon-desc"
      >
        详细信息
        <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>-->
    <div
      class="coupon iconfont icon-icon_about"
      v-for="item in list"
      :key="item.userCouponId"
      @click="selectCoupon(item)"
    >
      <div class="coupon-name">{{item.couponName}}</div>
      <div class="coupon-price">
        <span class="currency">￥</span>
        {{item.discountsCost}}
      </div>
      <p class="desc coupon-desc">使用期限: {{item.createDate}} 至 {{item.deadline}}</p>
      <router-link
        v-if="detailShow"
        :to="{name: 'coupons-detail',query: {couponName:item.couponName,createDate:item.createDate,deadline:item.deadline,discountsCost:item.discountsCost,id:item.userCouponId,from:from}}"
        tag="p"
        class="desc coupon-desc"
      >
        详细信息
        <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>
    <div v-if="!list.length" style="text-align:center;margin-top:80px">暂无数据</div>
  </div>
</template>

<script>
export default {
  props: { list: Array, from: String },
  data() {
    return {};
  },
  computed: {
    detailShow() {
      return this.$route.name === 'coupons-list';
    },
  },
  created() {
    console.log(this.$route);
  },
  methods: {
    selectCoupon(x) {
      console.log(x);
      console.log(this.from);
      this.$emit('select', x);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
</style>
