<template>
  <div class="loading">
    <img width="24" height="24" src="~@/assets/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入更多数据...',
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/scss/variables.scss';

.loading {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .desc {
    line-height: 20px;
    font-size: 12px;
    color: #bbb;
    margin-left: 8px;
  }
}
</style>
