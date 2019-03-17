import Vue from 'vue';
import showSwiperComp from './showSwiper.vue';

const showSwiperConstructor = Vue.extend(showSwiperComp);

let instance;

function showSwiperDialog(param, cb) {
  console.log(param);
  const { index, photos } = param;
  instance = new showSwiperConstructor({
    data: {
      index,
      photos,
      // photos: [
      //   'http://g.hiphotos.baidu.com/image/pic/item/023b5bb5c9ea15ce60632121b8003af33a87b20d.jpg',
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552378741009&di=bac554ed9e9c6338ae5f178ee6a2e84f&imgtype=0&src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201902%2F07%2F215259te54ibk8oikoz5od.jpg',
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552378681792&di=88bf36c0e90aa1a70f382536469fedbd&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F6%2F5302ca58a3ff3.jpg',
      // ],
    },
    methods: {
      closeLayer() {
        this.$el.parentNode.removeChild(this.$el);
      },
    },
  });

  // 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。
  instance.$mount();

  document.body.appendChild(instance.$el);
  return instance;
}

export default showSwiperDialog;
