<template>
  <div class="upload-pic">
    <ul class="photo-wrapper">
      <li
        class="photo"
        v-for="(pic, index) in photos"
        :key="index"
        :style="`backgroundImage:url(${pic})`"
      ></li>
      <li class="loading-position" v-show="isLoading">
        <div class="icon-wrapper">
          <div>
            <img src="~@/assets/loading.gif" alt>
            <p>Loading...</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="upload-btn" @click="$refs.uploadInput.click()">
      <i class="icon-plus">+</i>
      <input
        type="file"
        name="file"
        class="upload__input"
        multiple="multiple"
        ref="uploadInput"
        @change="chooseFile"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      isLoading: false,
      photos: []
    };
  },
  methods: {
    async chooseFile(ev) {
      this.isLoading = true;
      const file = ev.target.files[0];
      console.log(file);
      const url = await this.upload();
      this.photos.push(url);
      this.isLoading = false;
    },

    upload() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553016605480&di=df74c16dfb4a8db909457b1bcd255fdd&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F9345d688d43f8794fb05122ed01b0ef41bd53a33.jpg"
          );
        }, 2000);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.upload-pic {
  .photo-wrapper {
    display: inline;
    vertical-align: top;
    li {
      overflow: hidden;
      // background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      margin: 0 8px 8px 0;
      display: inline-block;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      &.loading-position {
        background: #eee;
        .icon-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #aaa;
          img {
            width: 20px;
            height: 20px;
            display: block;
            margin: 0 auto 5px;
          }
        }
      }
    }
  }
  .upload-btn {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
    display: inline-block;
    text-align: center;
  }
  .upload__input {
    display: none;
  }
}
</style>
