<template>
  <el-tabs class="tab-bar" tab-position="top" v-model="activeName">
    <el-tab-pane label="未使用" name="unused">
      <coupon :list="unused" :from="from" @select="selectBack"/>
    </el-tab-pane>
    <el-tab-pane label="已过期" name="expired">
      <coupon :list="expired"/>
    </el-tab-pane>
    <el-tab-pane label="已使用" name="used">
      <coupon :list="used"/>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
</style>
<script>
import coupon from '@/components/coupon.vue';
import { queryUserCoupons } from '@/api/api';
import eventBus from '../../eventBus';

export default {
  components: { coupon },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.from = from.name;
    });
  },
  computed: {},
  data() {
    return {
      activeName: 'unused',
      unused: [],
      expired: [],
      used: [],
      from: '',
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await queryUserCoupons();
      res.data.filter(item => {
        if (item.couponStatus == 1) {
          this.unused.push(item);
        }
        if (item.couponStatus == 3) {
          this.used.push(item);
        }
        if (item.couponStatus == 4) {
          this.expired.push(item);
        }
      });
    },
    useCoupons(item) {
      eventBus.$emit('selectCoupon', item);
      this.$router.go(-1);
    },
    selectBack(item) {
      if (this.from == 'book-detail') {
        this.useCoupons(item);
      }
    },
  },
};
</script>
