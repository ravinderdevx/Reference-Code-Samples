import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  resourcesList: any;
  activitiesList: any;

  resourceData = {
    Page: 1,
    Limit: 10,
    OrderBy: "ResourceId",
    OrderByDescending: false
  }
  activityData = {
    UserId:null,
    Page: 1,
    Limit: 10,
    OrderBy:"UserActivityId",
    OrderByDescending: false
  }

  constructor(private authservice: AuthService,private localStorageService:LocalStorageService) { }


  ngOnInit(): void {
    debugger;
    const data = this.localStorageService.getUserDetail();
    this.activityData.UserId= data.UserId
    this.authservice.getResources(this.resourceData).subscribe(
      response => {
        debugger;
        this.resourcesList = response.Data.resourceResponse;
      },
      error => {
        console.log(error);
      })
      this.authservice.getActivities(this.activityData).subscribe(
        response => {
          debugger;
          this.activitiesList = response.Data.activityResponse;
        },
        error => {
          console.log(error);
        })
  }

}
