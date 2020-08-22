import { LocalStorageService } from '../../../services';

const user = LocalStorageService.getUserDetail();
const isAuthenticated = !!user;

export default {
    isAuthenticated: isAuthenticated,
    user: isAuthenticated ? user : {},
    error: null
};