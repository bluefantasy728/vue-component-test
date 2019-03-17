<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot></slot>
      </div>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <!-- <div class="pullup-wrapper" v-if="pullUpLoad"> -->
        <!-- <div class="before-trigger" v-if="!isPullUpLoad"> -->
        <loading v-if="!noMoreData"></loading>
        <!-- </div> -->
        <div ref="noMoreData" class="no-more-data" v-else>没有更多数据了</div>
      </slot>
    </div>
    <!-- <slot
      name="pulldown"
      :pullDownRefresh="pullDownRefresh"
      :pullDownStyle="pullDownStyle"
      :beforePullDown="beforePullDown"
      :isPullingDown="isPullingDown"
      :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else>
            <span>{{refreshTxt}}</span>
          </div>
        </div>
      </div>
    </slot>-->
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import loading from '@/components/loading';

const COMPONENT_NAME = 'scroll';
const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

// 节流函数，为了节流监听滚动时的回调
const throttle = function(fn, interval = 300) {
  let func = fn,
    timer,
    firstTime = true;

  return function() {
    let args = arguments,
      me = this;

    if (firstTime) {
      func.apply(me, args);
      return (firstTime = false);
    }
    if (timer) return false;
    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      func.apply(me, args);
    }, interval);
  };
};

export default {
  // name: COMPONENT_NAME,
  components: { loading },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      },
    },
    probeType: {
      type: Number,
      default: 1, //1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
    },
    click: {
      type: Boolean,
      default: true,
    },
    ifListenScroll: {
      // 定义这个scroll是否要监听滚动事件，默认是支持监听
      type: Boolean,
      default: true,
    },
    listenBeforeScroll: {
      // 自定义，是否要在滚动前监听事件
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: DIRECTION_V,
    },
    scrollbar: {
      type: null,
      default: false,
    },
    pullDownRefresh: {
      // 用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，
      type: null,
      default: false,
    },
    pullUpLoad: {
      // 用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载
      type: null,
      default: false,
    },
    startY: {
      type: Number,
      default: 0,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
    freeScroll: {
      type: Boolean,
      default: false,
    },
    mouseWheel: {
      // 这个配置用于 PC 端的鼠标滚轮，默认为 false，。当设置为 true 或者是一个 Object 的时候，可以开启鼠标滚轮
      type: Boolean,
      default: true,
    },
    bounce: {
      default: true,
    },
    zoom: {
      default: false,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
      isPullingDown: false,
      isPullUpLoad: false,
      showLoadMore: true,
      listenScroll: this.ifListenScroll,
      pullUpDirty: true,
    };
  },
  computed: {},
  mounted() {
    setTimeout(() => {
      this.initScroll();
    }, 50);
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        mouseWheel: this.mouseWheel,
        bounce: this.bounce,
        zoom: this.zoom,
      };
      this.scroll = new BScroll(this.$refs.wrapper, options);

      // 监听滚动事件，只有在y和maxScrollY一样时，也就是滚到最底部时触发，执行从父组件传过来的scrollToEndFn函数，
      let scrollFn = throttle(() => {
        // y和maxScrollY是scroll实例的属性，这里的判断也可以在到达底部前一段距离就执行，看需求
        if (this.listenScroll && this.scroll.y === this.scroll.maxScrollY) {
          this.listenScroll = false; // 把监听关掉，避免一次滚动重复执行
          if (!this.noMoreData) {
            // 这步是为了在有数据并且加载的时候不让scroll回弹上去
            this.scroll.stop();
          }
          this.$emit('scrollToEndFn');
        }
      });

      let scrollEndFn = () => {
        console.log(this.noMoreData);
        let timer1 = setTimeout(() => {
          // noMoreData是每次父级传入的，如果传入true，说明没有新的数据了，就可以让最后一次结束后，过一段时间后回到正常位置
          if (this.noMoreData) {
            console.log('没数据了');
            const hWrapper = this.$refs.wrapper.offsetHeight;
            const hList = this.$refs.listWrapper.offsetHeight;
            const hNoMoreData = this.$refs.noMoreData.offsetHeight; // 显示没有更多数据的容器高度
            const offsetY = hList - hWrapper + hNoMoreData; // 这个是scrollToElement方法y的偏移量
            let timer2 = setTimeout(() => {
              this.scroll.scrollToElement(this.$refs.wrapper, 800, 0, offsetY);
              clearTimeout(timer1);
              clearTimeout(timer2);
              timer1 = null;
              timer2 = null;
              this.scroll.off('scrollEnd', scrollEndFn); // 最后一次，清掉所有监听事件
              // setTimeout(() => {
              //   this.scroll.off('scroll', scrollFn); // 最后一次，清掉所有监听事件
              // }, 800);
            }, 800);
          }
        }, 10);
        // 当一次滚动全部结束后，再次打开监听滚动事件
        this.listenScroll = true;
      };
      if (this.ifListenScroll) {
        // 如果要求这个scroll支持监听滚动事件，才绑定事件
        this.scroll.on('scroll', scrollFn);
        this.scroll.on('scrollEnd', scrollEndFn);
      }
    },

    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 50);
    },
  },
};
</script>

<style lang="scss" scoped>
.pullup-wrapper {
  height: 44px;
  line-height: 30px;
  img {
    height: 20px;
    width: 20px;
    display: inline-block;
    vertical-align: middle;
  }
  span {
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
  }
}
.no-more-data {
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #bbb;
  position: relative;
  top: 10px;
}
</style>
