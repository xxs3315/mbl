import { createRouter, createWebHistory } from "vue-router";
import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";

const routerBasePath = import.meta.env.VITE_CONFIG_BASE_URL;
console.log("routerBasePath", routerBasePath);

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: `${routerBasePath}`,
    name: "Designer",
    component: () => import("../views/Designer.vue"),
    meta: {
      title: "MBL Designer",
      menuKey: "designer",
    },
  },
  {
    path: `${routerBasePath}about`,
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      title: "About",
      menuKey: "about",
    },
  },
  {
    path: `${routerBasePath}:pathMatch(.*)*`,
    name: "NotFound",
    redirect: `${routerBasePath}`,
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    savedPosition: any,
  ) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - MixBoxLayout Vue`;
    }
    next();
  },
);

export default router;
