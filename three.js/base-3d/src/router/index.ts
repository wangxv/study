import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home.vue'),
  },
  {
    path: '/firstDome',
    name: 'firstDome',
    component: () => import(/* webpackChunkName: "about" */ '../views/firstDome.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
