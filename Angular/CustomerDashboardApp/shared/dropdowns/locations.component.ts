import { Component, OnInit , Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocalStorageService } from '@app/core/services';


@Component({
  selector: 'locations-dropdown',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationsDropdownComponent),
      multi: true
    }
  ],
  template: `
      <select [name]="name" [(ngModel)]="value" [attr.placeholder]="placeholder" [class]="className">
          <option [ngValue]="null">All Locations</option>
          <option *ngFor="let location of locations" [value]="location._id"> 
            {{location.LocationName}}
          </option>
      </select>
  `
})
export class LocationsDropdownComponent implements OnInit {
  locations :any;
  
  @Input()
  userId: string;

  @Input()
  name: string;
  
  @Input('value')
  val: string;
  
  @Input()
  className: string;
  
  @Input()
  placeholder: string;
  
  constructor(private localStorageService: LocalStorageService) { }
  
  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit() {
    if(this.userId && this.userId != '') 
      this.locations = this.localStorageService.getImpersonateUserDetails().Locations;
    else
      this.locations = this.localStorageService.getUserDetail().Locations;
  }

  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

}
