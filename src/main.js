import Vue from 'vue';
import App from './App.vue';
import { Vuetify, VApp, VGrid, VFooter, VDivider, VAlert, VProgressLinear, VToolbar, VMenu, VExpansionPanel, VDialog, VCard, VList, VBtn, VCheckbox, VTextarea, VIcon } from 'vuetify';
import 'vuetify/src/stylus/app.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
  components: {
    VApp,
    VGrid,
    VFooter,
    VToolbar,
    VDivider,
    VAlert,
    VProgressLinear,
    VMenu,
    VExpansionPanel,
    VDialog,
    VCard,
    VList,
    VBtn,
    VCheckbox,
    VTextarea,
    VIcon,
  },
});

new Vue({
  el: '#app',
  render: h => h(App),
});
