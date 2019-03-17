import Vue from 'vue';
import moment from 'moment';
import Cookies from 'js-cookie';
import { mapState, mapMutations } from 'vuex';

const iconMap = {
  '1': 'icon-icon_wall',
  '114': 'icon-icon_door',
  '122': 'icon-icon_chair',
  '130': 'icon-icon_light',
  '139': 'icon-icon_cold',
  '147': 'icon-icon_thunder',
};

Vue.mixin({
  data() {
    return {
      iconMap,
    };
  },
  computed: {
    ...mapState(['itemList']),
    user() {
      const user = Cookies.getJSON('user');
      return user ? user : {};
    },
  },
  methods: {
    ...mapMutations(['setItemList']),
    moment(date, type) {
      if (type) {
        return moment(date).format(type);
      }
      return moment(date).format('YYYY-MM-DD HH:mm:SS');
    },
  },
  filters: {
    moment(date, type) {
      if (type) {
        return moment(date).format(type);
      }
      return moment(date).format('YYYY-MM-DD HH:mm:SS');
    },
  },
});
