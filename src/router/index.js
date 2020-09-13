import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login';
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import UserList from "../components/admin/UserList";

Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      meta: {
        roles: ['超级管理员','普通管理员','普通用户']
      },
      children: [
        {
          path: '/welcome',
          component: Welcome,
          meta: {
            roles: ['超级管理员','普通管理员','普通用户']
          },
        },
        {
          path: '/user',
          component: UserList,
          meta: {
            roles: ['超级管理员']
          }
        },
      ]
    },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
