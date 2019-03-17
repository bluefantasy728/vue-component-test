<template>
  <div class="detail-wrap">
    <div class="coupon iconfont icon-icon_about">
      <div class="coupon-name">{{this.$route.query.couponName}}</div>
      <div class="coupon-price">
        <span class="currency">￥</span>
        {{this.$route.query.discountsCost}}
      </div>
      <p
        class="desc coupon-desc"
      >使用期限: {{this.$route.query.createDate}} 至 {{this.$route.query.deadline}}</p>
    </div>

    <ul class="rules desc">
      <li>使用条款：</li>
      <li>1.客户需在电子优惠券有效期内，到微软官方商城（www.microsoftstore.com.cn）进行使用。因客户未及时使用而导致该电子优惠券逾期失效，将被视为客户自行放弃该电子优惠券。</li>
      <li>2. 优惠券必须一次性使用，不累计，不找零，不兑现，并且使用时，一笔订单只能使用一张优惠券，订单总额必须大于电子优惠券面额。</li>
      <li>3. 注意：对于“买赠类型”促销活动发放的电子优惠券，如果发生订单退货，电子优惠券会失效。如果已经使用，将从退货款中扣除对应金额。</li>
    </ul>

    <el-button class="btn-primary" @click="use">立即使用</el-button>
  </div>
</template>

<style lang="scss" scoped>
.detail-wrap {
  padding: 12px 16px 0;
  .rules {
    li {
      line-height: 1.5;
      &:first-child {
        line-height: 3;
      }
    }
  }
  .btn-primary {
    margin-top: 30px;
  }
}
</style>
<script>
import eventBus from '../../eventBus';

export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {
    from() {
      return this.$route.query.from;
    },
  },
  data() {
    return {
      // activeName: 'unused',
    };
  },
  mounted() {},
  methods: {
    use() {
      console.log(this.from);
      if (this.from == 'account') {
        this.$router.push({
          name: 'book',
        });
      } else {
        eventBus.$emit('selectCoupon', {
          couponName: this.$route.query.couponName,
          userCouponId: this.$route.query.id,
        });
        this.$router.go(-2);
      }
    },
  },
};
</script>
