<template>
  <!-- <div class="previewer-wrapper">
      <img
        class="previewer-demo-img"
        v-for="(item, index) in previewerPhotos"
        :key="index"
        :src="item.src"
        width="100"
        @click="show(index)"
      >
      <div v-transfer-dom>
        <previewer :list="previewerPhotos" ref="previewer" :options="options"></previewer>
      </div>
  </div>-->
  <div class="carousel-area">
    <i class="iconfont icon-icon_next next fl" @click="prevSlider"></i>
    <el-carousel
      :autoplay="false"
      arrow="never"
      indicator-position="none"
      :loop="false"
      :ref="carouselName"
      :height="height"
    >
      <el-carousel-item v-for="(group,index) in regroupedPhotos" :key="index">
        <div class="photo-group">
          <div
            class="photo-item"
            v-for="(item,indexInner) in group"
            :key="indexInner"
            :style="`backgroundImage:url(${item})`"
            @click="fn(index, indexInner)"
          ></div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <i class="iconfont icon-icon_next prev fr" @click="nextSlider"></i>
  </div>
</template>

<script>
// 以3个元素为一个数组，归并原数组
function regroupArr(arr) {
  let res = [];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    temp.push(arr[i]);
    if (i % 3 == 2) {
      res.push(temp);
      temp = [];
    } else {
      if (i === arr.length - 1) {
        res.push(temp);
      }
    }
    // if (i === arr.length - 1) {
    //   res.push(temp);
    // }
  }
  return res;
}

export default {
  props: {
    thumbnails: {
      type: Array,
      default: function() {
        return [];
      },
    },
    photos: {
      type: Array,
      default: function() {
        return [];
      },
    },
    height: {
      type: String,
      default: function() {
        return '100%';
      },
    },
  },
  components: {},
  computed: {
    // 根据photos的数量计算要几张slider
    regroupedPhotos() {
      return this.thumbnails.length ? regroupArr(this.thumbnails) : [];
    },
  },
  data() {
    return {
      carouselName: 'carousel' + Date.now(),
    };
  },
  methods: {
    fn(index, indexInner) {
      const i = 3 * index + indexInner;

      this.$showSwiper({
        index: i,
        photos: this.photos,
      });
    },
    prevSlider() {
      this.$refs[this.carouselName].prev();
    },
    nextSlider() {
      this.$refs[this.carouselName].next();
    },
  },
};
</script>

<style scoped lang="scss">
.carousel-area {
  width: 100%;
  height: 66px;
  position: relative;
  box-sizing: border-box;
  .el-carousel {
    height: 100%;
    width: calc(100% - 64px);
    float: left;
    .el-carousel__container {
      height: 100%;
    }
    .el-carousel__item {
      height: 100%;
      display: flex;
      justify-content: space-around;
    }
    .photo-group {
      height: 100%;
    }
    .photo-group .photo-item {
      width: 66px;
      height: 66px;
      // background: #eee;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      float: left;
      margin-right: 13px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
  .prev,
  .next {
    width: 32px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .next {
    transform: rotateZ(180deg);
  }
}
.carousel-wrapper {
  position: relative;
  height: 90px;
  overflow: hidden;
}
.previewer-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  z-index: -3;
  visibility: hidden;
  img {
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: 50%;
  }
}
</style>
<style>
.pswp__zoom-wrap {
  transform-origin: center center !important;
}
</style>

