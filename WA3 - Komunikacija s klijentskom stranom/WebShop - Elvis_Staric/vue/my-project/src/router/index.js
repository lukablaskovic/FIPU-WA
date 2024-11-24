import { createRouter, createWebHistory } from "vue-router";
import Proizvodi from "../components/Proizvodi.vue";

const routes = [
  {
    path: "/",
    redirect: { path: "/proizvodi" },
  },
  {
    path: "/proizvodi",
    name: "proizvodi",

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Proizvodi,
  },

  {
    path: "/proizvodi/proizvod/:id",
    props: true,
    name: "proizvod",

    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Proizvod.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
