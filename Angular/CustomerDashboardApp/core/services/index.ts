import { ApiService } from '@app/core/services/api.service';

import { NotificationService } from "./notification.service";
import { AuthTokenService } from './auth-token.service';
import { AuthService } from "./auth.service";
import { StorageService } from './storage.service';
import { LayoutService } from './layout.service';
import { LocalStorageService } from './local-storage.service';
import { MessageService } from './message.service';
import { ResponseService } from './response.service';
import { ModalService } from './modal.service';
import { GlobalFilterService } from './global-filter.service';
import { LoaderService } from './loader.service';
import { AWSService } from './aws.service';


export const services = [
  NotificationService,
  StorageService,

  AuthTokenService,
  AuthService,
  ApiService,
  LayoutService,
  LocalStorageService,
  MessageService,
  ResponseService,
  ModalService,
  GlobalFilterService,
  LoaderService,
  AWSService
];

export * from './storage.service';
export * from './notification.service';

export * from './auth.service';
export * from './auth-token.service';
export * from './api.service';
export * from './layout.service';
export * from './local-storage.service';
export * from './message.service';
export * from './response.service';
export * from './modal.service';
export * from './global-filter.service';
export * from './loader.service';
export * from './aws.service';
