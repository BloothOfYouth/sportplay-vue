import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 添加全局样式 */
import './assets/css/global.css'
/* 引入iconfont */
import './assets/font/iconfont.css'
/* 引入axios */
import Axios from "axios";
import store from './store/index'
import Qs from 'qs'
import ElementUI from 'element-ui'

// http request 拦截器
Axios.interceptors.request.use(
    config => {
      if (localStorage.JWT_TOKEN) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Token = localStorage.JWT_TOKEN;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    });

Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 设置axios
Vue.prototype.$http = Axios
// 设置访问路径
Vue.prototype.$http.defaults.baseURL = "http://localhost"

Vue.config.productionTip = false

function haveRole(role,roles){
    if (!roles) {
        return true;
    }

    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === role) {
            return true;
        }
    }

    ElementUI.Message({
        showClose: true,
        message: '你无权限访问',
        type: "error"
    });
    return false;
}

// 路由权限拦截
// to 将要访问 from 从哪访问 next 路由通过
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("JWT_TOKEN");
    if(token){
        let stringify = Qs.stringify({token: token});
        Axios.post("tokenVerity",stringify).then(res => {
            console.log(res);
            console.log(to.meta.roles);
            if(to.path === '/login'){
                next('/home');
            }else{
                if (haveRole(res.data.role,to.meta.roles)) {
                    next();
                }else{
                    next('/home');
                }
            }

        }).catch(() => {
            localStorage.clear();
            next('/login');
        })
    }else{
        if(to.path === '/login'){
            next();
        }else{
            next('/login');
        }
    }


})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
