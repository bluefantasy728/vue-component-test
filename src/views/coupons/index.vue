<template>
  <div class="page">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  background: rgba(246, 246, 246, 1);
}
</style>
<script>
export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {},
  data() {
    return {
      activeName: 'unused',
    };
  },
  mounted() {},
  methods: {},
};
</script>
