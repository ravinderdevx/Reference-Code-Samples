interface WidgetModel {
    ColumnWidth: number;
    WidgetTitle: string;
    WidgetComponentName: string;
    IsCustomWidgetSettings: boolean;
    CustomWidgetSettings?: CustomWidgetSettings;
    UserWidgetId: any;
    _id: any;
}

interface CustomWidgetSettings {
    DateRangeType: string;
    StartDate: string;
    EndDate: string;
    Location: string;
    DataSync?: boolean;
    TopWords: number;
}

interface WidgetDataModel {
    data: WidgetModel;
    index: number;
    configObject: ConfigModel; 
    compInteraction: any;
    isMobile: boolean;
}

interface ConfigModel {
    configurationMode: boolean;
    screenUrl: string;
    dashboardConfigUrl: string;
    userId: string;
}
