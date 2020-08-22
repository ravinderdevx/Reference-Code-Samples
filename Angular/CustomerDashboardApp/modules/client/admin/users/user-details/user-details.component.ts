import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import $ from 'jquery';

import {
  MessageService,
  ResponseService,
  AuthService,
  NotificationService
} from "@app/core/services";

import { errorMessages, successMessages } from "@app/config/messages.config";
import { BaseClientComponent } from "@app/shared/base/base-client.component";


@Component({
  selector: 'sa-client-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent extends BaseClientComponent implements OnInit {
  showLoading: boolean;

  registerModel: any;
  
  clarityAdmin: boolean = false;
  screenServices: any = [];
  companyLocations: any = [];
  assignedScreensServices: any = [];
  selectedUserLocations: any = [];

  public validationOptions = {
    rules : {
      firstname : {
        required : true
      },
      lastname : {
        required : true
      },
      email : {
        required : true,
        email : true
      },
      password: {
        required: true,
        goodPassword: true
      }
    },

    // Messages for form validation
    messages: {
      firstname: {
        required: 'Please enter your first name'
      },
      lastname: {
        required: 'Please enter your last name'
      },
      email: {
        required: 'Please enter your email address',
        email: 'Please enter a VALID email address'
      },
      password: {
        required: 'Please enter password',
      }
    }
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    super(route, router);
  }

  ngOnInit() {
    this.screenUrl = this.screenUrl.split("/details")[0];
    this.clarityAdmin = this.companyId && this.companyId != ''? true: false;

    this.initializeModel();
    this.initializeJqueryActions();
    
    if(this.id && this.id != '') {
      this.getUserDetails();
    } else {
      this.loading = false;
      this.getCompanyScreensServices();
      this.getCompanyLocations();
    }
  }

  initializeModel(data: any = null): any {
    if(data) {
      this.registerModel = {
        _id: data._id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        Email: data.Email,
        Phone: data.Phone,
        JobTitle: data.JobTitle,
        Password: data.Password,
        CompanyAdmin: data.CompanyAdmin?true:false
      };

      this.selectedUserLocations = data.LocationIds && data.LocationIds.length > 0? data.LocationIds: [];
      this.assignedScreensServices = data.ScreenPermissions && data.ScreenPermissions.length > 0? data.ScreenPermissions: [];
    } else {
      this.registerModel = {
        _id: null,
        FirstName: null,
        LastName: null,
        Email: null,
        Phone: null,
        JobTitle: null,
        Password: null,
        CompanyAdmin: false
      };
      this.selectedUserLocations = [];
      this.assignedScreensServices = [];
    }
  }

  initializeJqueryActions() {
    const self = this;
    $(document).on('change', '.locations-treeview input[type="checkbox"]', function() {
      var $this = $(this),
      checked = $this.prop("checked"),
      container = $this.closest('li');

      container.find('input[type="checkbox"]')
      .prop({
          indeterminate: false,
          checked: checked
      });

      //self.onCheckboxChangeLocation($this.val(), checked);
      
      self.checkSiblings(container, checked, self);
    });
  }

  getUserDetails() {
    let request: any = {};
    request._id = this.id;
    request.companyId = this.companyId;
    request.screenUrl = this.screenUrl;

    this.authService.executeStitchFunction("getCompanyUserDetails", [request]).then(
      response => {
        this.loading = false;
        if (response.success == true) {
          this.initializeModel(response.data);

          this.getCompanyScreensServices();
          this.getCompanyLocations();
        }
      },
      error => {
        this.loading = false;
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }
  
  getCompanyScreensServices(): any {
    let request: any = {};
    request.companyId = this.companyId;

    this.authService.executeStitchFunction("getCompanyScreensServices", [request]).then(
      response => {
        if (response.success == true) {
          this.screenServices = response.data;
        }
      },
      error => {
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }

  getCompanyLocations() {
    let request: any = {};
    request.companyId = this.companyId;
    request.screenUrl = this.screenUrl;

    this.authService.executeStitchFunction("getCompanyLocations", [request]).then(
      response => {
        if (response.success == true) {
          this.companyLocations = this.getNestedChildren(response.data, null);
          this.checkLocationIfSelected();
        }
      },
      error => {
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }

  checkSiblings($el, checked, self) {
    var parent = $el.parent().parent(),
        all = true,
        indeterminate = false;

    $el.siblings().each(function() {
      return all = ($(this).children('label').children('input[type="checkbox"]').prop("checked") === checked);
    });

    if (all && checked) {
      parent.children('label').children('input[type="checkbox"]')
      .prop({
        indeterminate: false,
        checked: checked
      });

      self.checkSiblings(parent, checked, self);
    } 
    else if (all && !checked) {
      indeterminate = parent.children('ul').children('label').children('input[type="checkbox"]:checked').length > 0;

      parent.children('label').children('input[type="checkbox"]')
      .prop("checked", checked)
      .prop("indeterminate", indeterminate)

      self.checkSiblings(parent, checked, self);
    } 
    else {
      $el.parents("li").children('label').children('input[type="checkbox"]')
      .prop({
        indeterminate: true,
        checked: false
      });
    }
  }

  getNestedChildren(arr, parent) {
    var out = []
    for(var i in arr) {
        if(String(arr[i].ParentGroupId) == String(parent)) {
          var children = this.getNestedChildren(arr, arr[i]._id)

          if(children.length) {
              arr[i].Children = children
          }
          out.push(arr[i]);
        }
    }
    return out;
  }

  onCheckboxChange(screenId, _id, type, event) {
    let index = this.assignedScreensServices.findIndex(x => String(x.ScreenId) == String(screenId));

    if (event.target.checked) {
      if(index === -1) {
        if (type == 'screen') {
          this.assignedScreensServices.push({ ScreenId: _id });
          return;
        } else {
          this.assignedScreensServices.push({ ScreenId: screenId, ServiceIds: [] });
        }

        index = this.assignedScreensServices.length - 1;
      }

      this.assignedScreensServices[index].ServiceIds.push(_id);
    } else {
      if(index === -1)
        return;

      if (type == 'screen') {
          this.assignedScreensServices.splice(index, 1);
      } else {
        let childIndex = this.assignedScreensServices[index].ServiceIds.findIndex(x => String(x) == String(_id));

        if(childIndex !== -1) {
          this.assignedScreensServices[index].ServiceIds.splice(childIndex, 1);

          let serviceIdsLength = this.assignedScreensServices[index].ServiceIds.length;

          if(serviceIdsLength == 0) {
            this.assignedScreensServices.splice(index, 1);
          }
        }
      }
    }
  }

  checkIfSelected(screenId, _id, type) {
    let index = this.assignedScreensServices.findIndex(x => String(x.ScreenId) == String(screenId));
    if(type == 'service' && index !== -1) {
      index = this.assignedScreensServices[index].ServiceIds.findIndex(x => String(x) == String(_id));
    }
    return index !== -1 ? true: false;
  }

  // onCheckboxChangeLocation(locationId, checked) {
  //   if (checked) {
  //     this.selectedUserLocations.push(locationId);
  //   } else {
  //     let index = this.selectedUserLocations.findIndex(x => x == locationId);

  //     if(index !== -1)
  //       this.selectedUserLocations.splice(index, 1);
  //   }
  // }

  checkLocationIfSelected() {
    setTimeout(() => {
      const locations = this.selectedUserLocations;

      this.selectedUserLocations = [];
      locations.forEach(x => {
        $(`.location_${String(x)} input[type="checkbox"]`).trigger('click');
      });
    }, 1000);
  }

  getCheckedLocations() {
    const selectedIds = $(`.locations-treeview input[name="location[]"]:checked`).map(function(){
      return $(this).val();
    }).get();

    if(selectedIds && selectedIds.length > 0)
      return selectedIds;

    return [];
  }

  registerCompanyUser() {
    if(!$("form[name='registerUserform']").valid()) return false;

    if(!this.registerModel.CompanyAdmin) {
      this.selectedUserLocations = this.getCheckedLocations();
      
      if(this.selectedUserLocations.length == 0) {
        this.notificationService.errorSmallMessageBox(errorMessages.SELECT_LOCATION_FAILURE);

        return false;
      }

      if(this.assignedScreensServices.length == 0) {
        this.notificationService.errorSmallMessageBox(errorMessages.SELECT_SCREEN_SERVICES_FAILURE);

        return false;
      }
    }

    let registerForm = Object.assign({}, this.registerModel);
    registerForm.companyId = this.companyId;
    registerForm.LocationIds = this.selectedUserLocations;
    registerForm.ScreenPermissions = this.assignedScreensServices;
    registerForm.Password = null;

    Object.keys(registerForm).forEach((key) => (registerForm[key] == null || registerForm[key] == "") && delete registerForm[key]);
    
    registerForm.screenUrl = this.screenUrl;
    this.showLoading = true;

    this.authService
      .executeStitchFunction("createCompanyUser", [registerForm])
      .then(
        response => {
          if (response.success == true) {
            if(registerForm._id && registerForm._id != '') {
              this.showLoading = false;
              this.notificationService.successSmallMessageBox(successMessages.COMPANY_USER_UPDATION_SUCCESS);
            } else {
              this.registerStitchUser(this.registerModel);
            }
          } else {
            this.showLoading = false;
            this.notificationService.errorSmallMessageBox(response.message);
          }
        },
        error => {
          this.showLoading = false;
          console.log(error.message);

          const message = this.responseService.handleError(
            error,
            errorMessages.COMPANY_USER_CREATION_FAILURE
          );
          this.notificationService.errorSmallMessageBox(message);
        }
      );
  }

  registerStitchUser(registerForm) {
    this.authService.register(registerForm).then(
      res => {
        console.log(res);
        this.showLoading = false;
        this.notificationService.successSmallMessageBox(successMessages.COMPANY_USER_CREATION_SUCCESS);

        setTimeout(()=>{
          this.goBack();
        }, 2000);
      },
      error => {
        this.showLoading = false;

        const message = this.responseService.handleError(
          error,
          errorMessages.COMPANY_USER_CREATION_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }

  resetUserDashboard() {
    this.showLoading = true;
    
    let request: any = {};
    request._id = this.id;
    request.companyId = this.companyId;
    request.screenUrl = this.screenUrl;

    this.authService
      .executeStitchFunction("resetUserDashboard", [request])
      .then(
        response => {
          this.showLoading = false;

          if (response.success == true) {
            this.notificationService.successSmallMessageBox(response.message);
          } else {
            this.showLoading = false;

            this.notificationService.errorSmallMessageBox(response.message);
          }
        },
        error => {
          this.showLoading = false;
          console.log(error.message);

          const message = this.responseService.handleError(
            error,
            errorMessages.REGISTERATION_FAILURE
          );
          this.notificationService.errorSmallMessageBox(message);
        }
      );
  }

  resetDashboardConfirmation() {
    this.notificationService.smartMessageBox(
      {
        title: `<i class='fa fa-refresh txt-color-orangeDark'></i> Reset Configurations?`,
        content: "All screens of this user will reset to company detaults.",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          this.resetUserDashboard();
        }
      }
    );
  }

  goBack() {
    let queryParams = {};
    if(this.clarityAdmin)
      queryParams = { queryParams: { companyId: this.companyId } };

    this.router.navigate(['/client/admin/users'], queryParams);
  }
}
