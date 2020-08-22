import { constants } from '@app/config/constants';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ResponseService, AuthService, ModalService, LayoutService, ApiService, LoaderService } from '@app/core/services';
import { errorMessages } from '@app/config/messages.config';
import { BaseClientComponent } from '@app/shared/base/base-client.component';
import * as Widgets from '@app/shared/widgets/index';

import $ from 'jquery';

@Component({
  selector: 'widgets-page',
  templateUrl: './widgets-page.component.html',
  styleUrls: ['./widgets-page.component.css']
})
export class WidgetsPageComponent extends BaseClientComponent implements OnInit {
  @ViewChild('AddWidgetModal') addWidgetModal;
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  sortingChanged: boolean = false;

  selectorObject: any = {
    widgetClassSelector: '.jarviswidget',
    containerSelector: "#sortable-grid",
    widgetHeaderSelector: ".jarviswidget > header",
    widgetHeaderOptionSelector: ".jarviswidget-ctrls",
    widgetPlaceHolder: "jarviswidget-placeholder",
    previousOrderKey: 'data-prevorder'
  };

  configObject: ConfigModel = {
    configurationMode: false,
    screenUrl: null,
    dashboardConfigUrl: null,
    userId: null
  };

  widgetReplacementArray: any = [];

  isMobile: boolean;
  index: number = 0;
  componentsReferences = [];

  widgets: any = [];
  screenWidgets: any = [];

  constructor(
    private CFR: ComponentFactoryResolver,
    public route: ActivatedRoute, 
    public router: Router, 
    public layoutService: LayoutService,
    private apiService: ApiService,
    private modalService: ModalService,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private loaderService: LoaderService) { 
      super(route, router);
    }

  ngOnInit() {
    this.isMobile = this.layoutService.store.isMobile;

    this.configObject.dashboardConfigUrl = this.configUrl;
    this.configObject.configurationMode = (this.configUrl && this.configUrl != "") ? true : false;
    this.configObject.screenUrl = this.screenUrl;
    this.configObject.userId = this.userId;

    this.widgetReplacementArray = [
      {
        replaceWidgets: ['EmployeeWordCloudWidgetComponent', 'CustomerWordCloudWidgetComponent', 'ShopperWordCloudWidgetComponent'],
        replaceWith: 'WordCloudWidgetComponent'
      }
    ];
    this.getScreenWidgets();
  }

  getScreenWidgets() {
    let request: any = {};
    if(this.configObject.configurationMode) {
      request.screenUrl = this.configObject.dashboardConfigUrl;
      request.configScreenUrl = this.configObject.screenUrl;
    } else {
      request.screenUrl = this.configObject.screenUrl;
      request.userId = this.configObject.userId;
    }
    
    request.configurationMode = this.configObject.configurationMode;
    this.authService.executeStitchFunction("getScreenWidgets", [request]).then(
      response => {
        if (response.success == true) {
          this.widgets = response.data.default_widgets;
          this.screenWidgets = response.data.available_widgets;
          this.loadComponents();
        }
      },
      error => {
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }

  loadComponents() {
    this.widgets.forEach((widget, index) => {
      this.createComponent(widget);
    });

    this.applySortable();
  }

  createComponent(widget) {
    const widgetName = this.getWidgetComponentName(widget.WidgetComponentName);

    if(!Widgets[widgetName]) return;
    let componentFactory = this.CFR.resolveComponentFactory(Widgets[widgetName]);
    let componentRef: any= this.VCR.createComponent(componentFactory);
    let currentComponent = <WidgetDataModel>componentRef.instance;

    currentComponent.data = widget;
    currentComponent.index = ++this.index;
    currentComponent.configObject = this.configObject;
    currentComponent.isMobile = this.isMobile;

    // prividing parent Component reference to get access to parent class methods
    currentComponent.compInteraction = this;

    // add reference for newly created component
    this.componentsReferences.push(componentRef);
  }

  getWidgetComponentName(widgetComponentName: string): string{
    let tempWidgetObj = this.widgetReplacementArray.find(x => x.replaceWidgets.indexOf(widgetComponentName) !== -1);

    if(tempWidgetObj) {
      return tempWidgetObj.replaceWith;
    }

    return widgetComponentName;
  }

  remove(index: number) {
    if (this.VCR.length < 1)
      return;

    let componentRef = this.componentsReferences.filter(x => x.instance.index == index)[0];

    let vcrIndex: number = this.VCR.indexOf(componentRef)

    // removing component from container
    this.VCR.remove(vcrIndex);

    this.componentsReferences = this.componentsReferences.filter(x => x.instance.index !== index);
  }

  addNewComponent(widget) {
    this.widgets.push(widget);
    
    this.createComponent(widget);
  }

  applySortable() {
    let selectorsObj: any = Object.assign({}, this.selectorObject);

    $(selectorsObj.containerSelector).sortable({
      placeholder: selectorsObj.widgetPlaceHolder,
      tolerance: 'pointer',
      //revert: 'invalid',
      forceHelperSize: true,
      forcePlaceholderSize: true,
      connectWith: selectorsObj.containerSelector,
      handle: selectorsObj.widgetHeaderSelector,
      cancel: selectorsObj.widgetHeaderOptionSelector,
      scroll: true,
      delay: 100,
      start: (event, ui) => {
       // $(ui.item).attr(selectorsObj.previousOrderKey, ui.item.index() + 1);

        let $widget = $(ui.item).find(selectorsObj.widgetClassSelector);
        //set the placeholder size to the block size
        $(`.${selectorsObj.widgetPlaceHolder}`).css({
          width: $widget.width(),
          height: $widget.height()
        });             
      },
      update: (event, ui) => {
        // var newOrder = ui.item.index() + 1;
        // var oldOrder = Number($(ui.item).attr(previousOrderKey));
        
        // $(ui.item).removeAttr(previousOrderKey);

        //this.changePosition(oldOrder, newOrder);

        this.sortingChanged = true;
      
      }
    }).disableSelection();
  }

  // changePosition(old_order: number, new_order: number) {
  //   if(new_order < old_order) {
  //     this.widgets = this.widgets.map(widget => {
  //       if(widget.Order < old_order &&  widget.Order >= new_order)
  //         widget.Order++;

  //       return widget;
  //     });
  //   } else {
  //     this.widgets = this.widgets.map(widget => {
  //       if(widget.Order > old_order && widget.Order <= new_order)
  //         widget.Order--;

  //       return widget;
  //     });
  //   }

  //   const index = this.widgets.findIndex(x => x.Order == old_order);
  //   if(index !== -1) {
  //     this.widgets[index].Order = new_order;
  //   }
    

    // while (old_index < 0) {
    //   old_index += this.cloneWidgets.length;
    // }
    // while (new_index < 0) {
    //     new_index += this.cloneWidgets.length;
    // }
    // if (new_index >= this.cloneWidgets.length) {
    //   var k = new_index - this.cloneWidgets.length;
    //   while ((k--) + 1) {
    //       this.cloneWidgets.push(undefined);
    //   }
    // }
    // this.cloneWidgets.splice(new_index, 0, this.cloneWidgets.splice(old_index, 1)[0]);  
 // }

  // comparePosition() {
  //   const widget_string = this.widgets.map(x => String(x._id)).join(',');
  // }

  changeWidgetSorting() {
    let widgets = [];
    $(`${this.selectorObject.containerSelector} > div[data-widgetid]`).each((index, element) => { 
      let widget: any = {};
      if(this.configObject.configurationMode)
        widget = this.widgets.find(x => String(x._id) == $(element).attr('data-widgetid'));
      else
        widget = this.widgets.find(x => String(x.UserWidgetId) == $(element).attr('data-widgetid'));

      widget.Order = index + 1;

      widgets.push(widget);
    });

    let request: any = {};
    if(this.configObject.configurationMode) {
      request.screenUrl = this.configObject.dashboardConfigUrl;
      request.configScreenUrl = this.configObject.screenUrl;
    } else {
      request.userId = this.configObject.userId;
      request.screenUrl = this.configObject.screenUrl;
    }

    request.configurationMode = this.configObject.configurationMode;
    request.widgets = widgets;
    this.loading = true;
    this.authService.executeStitchFunction("saveWidgetOrderConfiguration", [request]).then(
      response => {
        this.loading = false;
        if (response.success == true) {
          this.sortingChanged = false;
        }
      },
      error => {
        this.loading = false;
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }

  openAddWidgetModal() {
    this.modalService.openModal(this.addWidgetModal);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  print(): void {
    this.loaderService.startLoading();

    const $bodyElement = document.body;
    const $contentElement = document.getElementById('content');
    
    $bodyElement.classList.add('printmode');
   
    this.layoutService.triggerResizeWindowEvent();

    setTimeout(() => {
      const content = $contentElement.innerHTML;
  
      this.apiService.fetch(constants.printDirectoryUrl + 'widget-page.html', { responseType: 'text' }).subscribe(response => {
        let html: string = response.replace('{content}', content);
        let windowPopup = window.open('', '_blank', `top=0,left=0,width=${screen.availWidth},height=${screen.availHeight},fullscreen='yes'`);    
        windowPopup.document.open();
        windowPopup.document.write(html);
        windowPopup.document.close();
  
        $bodyElement.classList.remove('printmode');
        
        this.layoutService.triggerResizeWindowEvent();
        this.loaderService.stopLoading();
      }, error => {
        
      });
    }, 2000);
  }
}
