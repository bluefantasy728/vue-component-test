<style lang="scss" scoped>
.page {
  padding: 0;
}
.logo {
  display: block;
  width: 130px;
  height: 150px;
  margin: 35px auto 20px;
  background: url('~@/assets/img/star-logo.png') center center / contain
    no-repeat;
}
.intro {
  margin: 0 20px;
  line-height: 17px;
  text-align: justify;
  font-size: 12px;
}
h5 {
  margin: 15px 0 8px 20px;
  color: #9b9b9b;
  font-size: 12px;
}
</style>
<template>
  <div class="page">
    <i class="logo"></i>
    <p
      class="intro"
    >SUNNY创立于1995年7月，是一家专业从事工装项目咨询、设计、施工、建材、IT、家具及售后维护的集团化公司，项目涉及写字楼、办公室、酒店、餐饮、厂房、连锁店铺、商业空间等。公司现下辖全资、控股、参股公司12家，在北京、广州、沈阳、香港、东京等国内外设有分支机构和办事处，汇聚了一批境内外行业精英。 SUNNY凭借良好的服务理念和专业管理，长期服务于外资企业和日资企业。成为“上海环球金融中心”等一批重大装饰工程的指定承接单位，也是著名时尚零售巨头“优衣库”的战略合作伙伴，长期支持优衣库的发展，完成优衣库全球旗舰店、优衣库中国旗舰店的室内外装饰工程，赢得了良好的经济效益和社会品牌信誉。</p>
    <h5>收费标准</h5>
  </div>
</template>
<script>
export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
