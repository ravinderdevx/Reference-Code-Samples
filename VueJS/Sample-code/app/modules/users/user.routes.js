import AppUser from './user.vue';
import AppUserHome from './home/home.vue';
import AppUserChangePassword from './change-password/change-password.vue';

const userRoutes = [
  {
    path: '/users',
    component: AppUser,
    children: [
      {
        path: 'home',
        name: 'home',
        component: AppUserHome
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: AppUserChangePassword
      },
      {
        path: '',
        redirect: { name: 'home' }
      },
    ]
  }
];

export default userRoutes;
