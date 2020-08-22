import AppAuth from './auth.vue';

import AuthLogin from './login/login.vue';
import AuthRegister from './register/register.vue';
import AuthForgotPassword from './forgot-password/forgot-password.vue';
import AuthResetPassword from './reset-password/reset-password.vue';
import AuthVerifyEmail from './verify-email/verify-email.vue';

const authRoutes = [
    {
        path: '/',
        component: AppAuth,
        children: [
            {
                path: '',
                redirect: { name: 'login' }
            },
            {
                path: 'login',
                name: 'login',
                component: AuthLogin
            },
            {
                path: 'register',
                name: 'register',
                component: AuthRegister
            },
            {
                path: 'forgot-password',
                name: 'forgot-password',
                component: AuthForgotPassword
            },
            {
                path: 'reset-password',
                name: 'reset-password',
                component: AuthResetPassword
            },
            {
                path: 'verify-email',
                name: 'verify-email',
                component: AuthVerifyEmail
            }

        ]
    }
];



export default authRoutes;