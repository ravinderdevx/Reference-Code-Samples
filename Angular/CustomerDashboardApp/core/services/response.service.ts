import { Router, ActivatedRoute } from "@angular/router";
import { Injectable, Injector } from "@angular/core";

@Injectable()
export class ResponseService {
  constructor(private router: Router, private route: ActivatedRoute) {
    
  }

  handleError(error: any, message: string) {
    console.log(error);
    if(error) {
      // if(error.name == 'StitchServiceError') {
      //   return error.error;
      // } else if(error.name == 'InvalidSession') {
      //   //this.localStorageService.logout();
      //   //this.router.navigate(['/login'], { queryParams: { returnUrl: this.route.url }});
      // }
      return error.message;
    } else {
      return message;
    }
  }
}
