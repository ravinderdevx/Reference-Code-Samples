import { services } from './../../core/store/index';
import { Component, OnInit , Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocalStorageService } from '@app/core/services';

@Component({
  selector: 'services-dropdown',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServicesDropdownComponent),
      multi: true
    }
  ],
  template: `
      <select [name]="name" [(ngModel)]="value" [attr.required]="required?'required':null" [attr.placeholder]="placeholder" [class]="className">
        <option [ngValue]="null">Select Service</option>    
        <option *ngFor="let service of services" [ngValue]="service"> 
            {{service.ServiceName}}
          </option>
      </select>
  `
})
export class ServicesDropdownComponent implements OnInit {
  services :any;
  
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

  @Input()
  required: string;
  
  constructor(private localStorageService: LocalStorageService) { }
  
  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit() {
    if(this.userId && this.userId != '') 
      this.services = this.localStorageService.getImpersonateUserDetails().Services;
    else
      this.services = this.localStorageService.getUserDetail().Services;
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
