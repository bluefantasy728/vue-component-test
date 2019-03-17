<template>
  <div class="page">
    <ul class="item-tabs">
      <li
        v-for="item in itemList"
        class="item"
        :key="item.repairId"
        :class="activeId == item.repairId ? 'active' : ''"
        @click="changeActive(item.repairId)"
      >
        <span class="iconfont" :class="iconMap[item.repairId]"></span>
        <span class="title">{{ item.repairName }}</span>
      </li>
    </ul>

    <!-- label-width="80px" -->
    <el-form class="cell-list" label-position="left">
      <el-form-item
        v-for="item in childList[activeId]"
        :key="item.repairId"
        class="cell"
        :label="item.repairName"
        @click.native="chooseProject(item)"
      >
        <span class="iconfont icon-icon_next"></span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  padding-top: 86px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /deep/ .item-tabs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 86px;
    display: flex;
    align-items: center;
    background-color: $primary-black;
    justify-content: space-around;
    .item {
      line-height: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      &.active .iconfont,
      &.active .title {
        color: #fcec0c;
      }
      .iconfont {
        font-size: 32px;
        color: #ecf0f5;
      }
      .title {
        font-size: 12px;
        padding-top: 8px;
        color: #9b9b9b;
      }
    }
  }
  /deep/ .el-form-item__content {
    text-align: right;
  }
  .cell-list {
    flex: 1;
    padding: 0 32px;
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>

<script>
import { queryRepairCategoryList } from '@/api/api';

export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  watch: {
    $route(newVal, oldVal) {
      console.log(newVal);
      const query = newVal.query;
      this.activeId = query.repairId;
      query.repairId && this.queryMatainProjects(query.repairId);
    },
  },
  data() {
    return {
      childList: {},
      activeId: '',
    };
  },
  created() {
    this.activeId = this.$route.query.repairId;
    this.queryMatainProjects(this.activeId);
  },
  methods: {
    async queryMatainProjects(id) {
      const res = await queryRepairCategoryList({
        urlSuffix: `/${id}`,
      });
      if (res.success) {
        this.$set(this.childList, id, res.data);
      }
    },
    changeActive(id) {
      this.activeId = id;
      if (this.childList[id]) return;
      this.queryMatainProjects(id);
    },
    chooseProject(item) {
      this.$storage.set('STARSERVICE_MAINTAIN_PROJECTID', item.repairId);
      this.$router.push({
        name: 'book-detail',
        query: {
          project: item.repairName,
          projectId: item.repairId,
          repairId: this.activeId,
        },
      });
    },
  },
};
</script>
