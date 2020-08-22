import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html'
})
export class SystemInfoComponent implements OnInit {
  deviceInfo: any;
  deviceType: string;

  constructor(private deviceService: DeviceDetectorService) {
  }

  ngOnInit() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceType = this.deviceService.isMobile() ? "Mobile" : this.deviceService.isTablet() ? "Tablet" : this.deviceService.isDesktop() ? "Desktop" : "Unknown";
    //console.log(this.deviceInfo);
   
  }

}
