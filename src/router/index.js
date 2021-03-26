import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    meta: { title: '注册' },
    component: () => import('@/views/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    meta: { title: '项目管理', icon: 'project' },
    children: [
      {
        path: 'list',
        name: 'ProjectList',
        component: () => import('@/views/project/index'),
        meta: { title: '项目列表' },
      },
      {
        path: 'edit',
        name: 'ProjectEdit',
        component: () => import('@/views/project/edit/index'),
        meta: { title: '项目信息' },
        hidden: true
      },
    ]
  },

  {
    path: '/project/log',
    name: 'ProjectLog',
    component: () => import('@/views/project/projectLog'),
    meta: { title: '项目日志' },
    hidden: true
  },

  {
    path: '/personal',
    component: () => import('@/views/personalCenter/index'),
    meta: { title: '个人中心' },
    hidden: true
  },

  {
    path: '/interface/interfaceConfig',
    component: () => import('@/views/interfaceManager/interfaceConfig'),
    meta: { title: '接口管理' },
    hidden: true,
  },

  {
    path: '/interface/interfaceConfig/create',
    name: 'InterfaceCreate',
    component: () => import('@/views/interfaceManager/interfaceInfo'),
    meta: { title: '接口信息创建' },
    hidden: true
  },

  {
    path: '/interface/interfaceConfig/edit',
    name: 'InterfaceEdit',
    component: () => import("@/views/interfaceManager/interfaceInfo"),
    meta: { title: '接口信息编辑' },
    hidden: true
  },

  {
    path: '/interface/interfaceLog',
    component: () => import('@/views/interfaceManager/interfaceLog'),
    meta: { title: '接口日志' },
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
