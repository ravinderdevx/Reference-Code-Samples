import { Component, OnInit , Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { dateRangeTypes } from '@app/config/constants';


@Component({
  selector: 'date-range-dropdown',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeDropdownComponent),
      multi: true
    }
  ],
  template: `
      <select [name]="name" [(ngModel)]="value" [attr.placeholder]="placeholder" [class]="className">
          <option *ngFor="let dateRange of dateRangeTypes"  [value]="dateRange.value"> 
            {{dateRange.text}}
          </option>
      </select>
  `
})
export class DateRangeDropdownComponent implements OnInit {
  dateRangeTypes:any;

  @Input()
  name: string;

  @Input('value')
  val: string;

  @Input()
  className: string;

  @Input()
  placeholder: string;
  
  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit() {
    this.dateRangeTypes = dateRangeTypes;
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
