import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '@app/core/services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService, private changeDetectionRef: ChangeDetectorRef) {
    this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value) => {
      this.loading = value;
      this.changeDetectionRef.detectChanges();
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
