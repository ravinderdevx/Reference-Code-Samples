import { SuperAdminAuthGuard } from './super-admin-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthGuard } from './auth.guard';
import { UnAuthGuard } from './unauth.guard';

export const guards = [
    SuperAdminAuthGuard,
    AdminAuthGuard,
    AuthGuard,
    UnAuthGuard
];

export * from './super-admin-auth.guard';
export * from './admin-auth.guard';
export * from './auth.guard';
export * from './unauth.guard';