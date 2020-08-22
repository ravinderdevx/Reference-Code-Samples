import Vue from 'vue';
import Router from 'vue-router';

import { authRoutes } from './modules/auth';
import { userRoutes } from './modules/users';

//import { AppPageNotFound } from './shared/components';

Vue.use(Router);

const appRoutes = [
  {
    path: '',
    redirect: '/login',
    auth: false
  }
  // {
  //   path: '*',
  //   name: 'page-not-found',
  //   component: AppPageNotFound
  // }
];
const routes = [
  ...authRoutes,
  ...userRoutes,
  ...appRoutes
];




export default new Router({
  mode: 'history',
  routes
});


// routes.beforeEach((to, from, next) => {
//   debugger;
//   // redirect to login page if not logged in and trying to access a restricted page
//   const auth = ['/change-password', '/reset-password'];
//   const authRequired = auth.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   if (authRequired && !loggedIn) {
//     return next('/login');
//   }

//   next();
// })