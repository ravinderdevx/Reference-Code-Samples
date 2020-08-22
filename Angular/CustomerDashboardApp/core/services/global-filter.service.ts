import {Component, OnInit, Injectable} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { defaultFilters } from '@app/config/constants';


@Injectable()
export class GlobalFilterService {
  private userId: string;
  private subject:Subject<any>;
  store: CustomWidgetSettings;

  trigger() {
    this.subject.next(this.store)
  }

  subscribe(next, err?, complete?) {
    return this.subject.subscribe(next, err, complete)
  }

  constructor(
    private route: ActivatedRoute,
    public localStorageService: LocalStorageService
  ) {
    this.subject = new Subject();
    this.route.queryParamMap.subscribe(queryParams => {
      this.userId = queryParams.get("userId");
      this.setStore();
    });

    // fromEvent(window, 'resize').
    //   pipe(
    //     debounceTime(100),
    //     map(()=>{
    //       this.trigger()
    //     })
    //   )
    // .subscribe()
  }

  setStore() {
    const userDetails = this.userId && this.userId != '' ? this.localStorageService.getImpersonateUserDetails() : this.localStorageService.getUserDetail();
      
    if(userDetails && userDetails.GlobalFilterSettings) {
      this.store = userDetails.GlobalFilterSettings;
    } else {
      this.store = Object.assign({}, defaultFilters, { DataSync: true });
    }
  }

  changeGlobalFilters(store) {
    this.store = store;
    this.trigger();
  }


}
