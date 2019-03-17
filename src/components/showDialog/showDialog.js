import Vue from 'vue';
import showDialogComp from './showDialog.vue';

const showDialogConstructor = Vue.extend(showDialogComp);

let instance;

function showDialogDialog(param, cb) {
  instance = new showDialogConstructor({
    data: {
      orderId: param.orderId,
      orderStatus: param.orderStatus,
      version: param.version,
    },

    methods: {
      closeLayer() {
        this.$el.style.transition = '.2s opacity';
        this.$el.style.opacity = '0';
        setTimeout(() => {
          this.$el.parentNode.removeChild(this.$el);
        }, 200);
      },
      refreshData() {
        param.refreshData();
      },
    },
  });

  // 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。
  instance.$mount();

  document.body.appendChild(instance.$el);
  return instance;
}

export default showDialogDialog;
