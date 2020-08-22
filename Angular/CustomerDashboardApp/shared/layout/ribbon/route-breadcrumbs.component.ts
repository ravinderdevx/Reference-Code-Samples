import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import { filter } from 'rxjs/operators';
import { LocalStorageService } from '@app/core/services';
import { constants } from '@app/config/constants';

@Component({
  selector: 'sa-route-breadcrumbs',
  template: `
        <ol class="breadcrumb">
           <li *ngFor="let item of items" (click)="goToUrl(item)">{{item.title}}</li>
        </ol>
  `,
  styles: []
})
export class RouteBreadcrumbsComponent implements OnInit, OnDestroy {

  public items: any[] = [];
  private sub;
  private userId;
  private url: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { 
    
  }

  ngOnInit() {
    this.extract(this.router.routerState.root)
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    )

      .subscribe(v => {
        this.url = "";
        this.items = [];
        this.extract(this.router.routerState.root)
      });

      this.route.queryParamMap.subscribe(queryParams => {
        this.userId = queryParams.get("userId");
      });

  }

  goToUrl(item) {
    let url = "";
    switch(item.title) {
      case 'Home':
        if(this.userId)
          url = constants.clientUrl;
        else
          url = this.localStorageService.getRedirectUrl();
        break;

      case 'Admin':
        const clarityAdmin = this.localStorageService.isClarityAdmin();
        url = clarityAdmin ? this.localStorageService.getRedirectUrl(): item.url;
        break;

      default:
        url = item.url;
    }

    if(this.userId)
      this.router.navigate([url], { queryParams: { userId: this.userId } });
    else
      this.router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  extract(route) {
    let pageTitle = route.data.value['pageTitle'];
    if(route.snapshot.url.length > 0) {
      this.url += `/${route.snapshot.url[0].path}`;
    }

    if(pageTitle && this.items.findIndex(x => x.title === pageTitle) == -1){
      this.items.push({ url: this.url, title: route.data.value['pageTitle']})
    }
    
    if(route.children){
      route.children.forEach(it=>{
        this.extract(it)
      })
    }
  }


}
