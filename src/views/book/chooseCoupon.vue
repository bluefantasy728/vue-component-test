<template>
  <div class="page">
    <coupon
      v-for="item in couponsList"
      :key="item.userCouponId"
      @click.native="back(item.userCouponId)"
    />
    <p class="no-data" v-show="!couponsList.length">暂无数据</p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  background: rgba(246, 246, 246, 1);
  padding: 12px 16px 0;
}
</style>
<script>
import coupon from '@/components/coupon.vue';
import { queryUserCoupons } from '@/api/api';

export default {
  components: { coupon },
  beforeRouteEnter(to, from, next) {
    next();
  },
  props: {
    couponsList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  data() {
    return {};
  },
  mounted() {
    this.getList();
  },
  methods: {
    back(id) {
      this.$router.push({
        name: 'book-detail',
        query: {
          couponId: id,
        },
      });
    },
    async getList() {
      const res = await queryUserCoupons({
        params: {
          isCanUse: true,
          maintainProId: this.$route.query.maintainProId,
        },
      });
      console.log(res);
    },
  },
};
</script>
