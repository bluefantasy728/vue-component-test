<style lang="scss" scoped>
.layer-swiper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 99;
}
.swiper-container {
  // min-height: 250px;
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
.swiper-slide {
  text-align: center;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    min-width: 100%;
    max-width: 100%;
    // vertical-align: middle;
    // width: 100%;
    // height: 100%;
  }
}
</style>

<template>
  <div class="layer-swiper" @click="closeLayer">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(photo, index) in swiperPhotos" :key="index">
        <img :src="photo" alt>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  components: {
    swiper,
    swiperSlide,
  },
  props: {},
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  data() {
    return {
      swiperOption: {},
      swiperPhotos: [],
    };
  },
  mounted() {
    // console.log(this.photos);
    this.swiperPhotos = this.photos;
    this.swiper.slideTo(this.index, 0, false);
  },
  watch: {},
  methods: {},
};
</script>
