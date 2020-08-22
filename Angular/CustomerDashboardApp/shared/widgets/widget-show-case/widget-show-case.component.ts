import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import * as Widgets from '../index';

@Component({
  selector: 'sa-widget-show-case-component',
  templateUrl: './widget-show-case.component.html',
  styleUrls: ['./widget-show-case.component.css']
})
export class WidgetShowCaseComponent implements OnInit, OnDestroy {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  @Input() widgets: WidgetModel[];
  @Input() screenUrl: string;

  index: number = 0;
  componentsReferences = [];


  constructor(private CFR: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponents();
  }

  ngOnDestroy() {
    //clearInterval(this.interval);
  }

  loadComponents() {
    this.widgets.forEach((widget, index) => {
      this.createComponent(widget);
    });
  }

  createComponent(widget) {
    let componentFactory = this.CFR.resolveComponentFactory(Widgets[widget.WidgetComponentName]);
    let componentRef: any= this.VCR.createComponent(componentFactory);
    let currentComponent = <WidgetDataModel>componentRef.instance;

    currentComponent.data = widget;
    currentComponent.index = ++this.index;
    //currentComponent.screenUrl = this.screenUrl;

    // prividing parent Component reference to get access to parent class methods
    currentComponent.compInteraction = this;

    // add reference for newly created component
    this.componentsReferences.push(componentRef);

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
}
