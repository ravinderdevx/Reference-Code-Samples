import { LocalStorageService } from './local-storage.service'
import { LoadingScreenService } from "./loading-screen.service";

export const services = [
    LocalStorageService,
    LoadingScreenService
  
];

export * from "./local-storage.service";
export * from "./loading-screen.service";


