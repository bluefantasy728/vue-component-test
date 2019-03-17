<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  background: #f6f6f6;
}
.section {
  margin: 16px;
  padding: 12px 15px 0;
  background: #fff;
  .title {
    color: #9b9b9b;
    font-size: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f1f1;
  }
  /deep/ .el-textarea__inner {
    border: none;
    height: 140px;
  }
}
/deep/ .el-button {
  display: block;
  width: 315px;
  height: 48px;
  margin: 32px auto;
}
</style>
<template>
  <div class="page">
    <div class="section">
      <p class="title">维修工单照片</p>
      <el-upload
        class="upload-list"
        :with-credentials="true"
        action
        :auto-upload="false"
        list-type="picture-card"
        :file-list="photos"
        :on-remove="pictureRemove"
        :on-preview="picturePreview"
        :on-change="pictureChange"
        :multiple="true"
      >
        <!-- :http-request="reWriteUpload" -->
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <div class="section">
      <p class="title">备注说明</p>
      <el-input class="textarea" type="textarea" resize="none" v-model="maintainRemark"></el-input>
    </div>
    <el-button type="primary" @click="submit">确认</el-button>
  </div>
</template>
<script>
import config from '@/config';
import { updateOrderInfo, tempUploadPic } from '@/api/api';
export default {
  components: {},
  computed: {
    maintainPhoto() {
      return this.photos.join(';');
    },
  },
  data() {
    return {
      photos: [],
      maintainRemark: '',
      version: this.$route.query.version,
      id: this.$route.query.orderId,
      formData: new FormData(),
    };
  },
  created() {},
  methods: {
    pictureRemove(file, fileList) {},
    picturePreview() {},
    async pictureChange(file, fileList) {
      let formData = new FormData();
      formData.append('file', file.raw);
      const res = await tempUploadPic({
        data: formData,
      });
      if (res.success && res.status === '200') {
        this.photos.push(res.data);
      }
    },
    async submit() {
      const res = await updateOrderInfo({
        urlSuffix: '/' + this.id,
        params: {
          version: this.version,
          maintainPhoto: this.maintainPhoto,
          maintainRemark: this.maintainRemark,
          orderStatus: '6',
        },
      });
      if (res.success && res.status === '200') {
        this.$message.success('完工确认成功！');
        this.$router.push({
          name: 'order',
        });
      }
    },
  },
};
</script>
