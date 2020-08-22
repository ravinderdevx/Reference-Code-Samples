export const constants: any = {
    adminUrl: '/admin',
    clientUrl: '/client',
    loginUrl: '/login',
    helpDocumentUrl: '/assets/help/',
    printDirectoryUrl: '/assets/print/'
}

export const defaultFilters: CustomWidgetSettings = {
    DateRangeType: 'PAST_30_DAYS',
    StartDate: null,
    EndDate: null,
    Location: null,
    TopWords: 25
}

export const widgetConfig: any = {
    height: {
        cloud: 300,
        multi_chart: 400,
        chart: 300,
        fullscreen: () => {
            let height = $(window).height() - $('#jarviswidget-fullscreen-mode>div>header').height();
            if($('body').hasClass('printmode') && height > 850) {
                height = 850;
            }
            return height;
        }
    }
}

export const dateRangeTypes: any = [{
    value: 'PAST_30_DAYS',
    text: 'Past 30 Days'
}, {
    value: 'CURRENT_MONTH',
    text: 'Current Month'
}, {
    value: 'PRIOR_MONTH',
    text: 'Prior Month'
}, {
    value: 'CURRENT_QUARTER',
    text: 'Current Quarter'
}, {
    value: 'PAST_90_DAYS',
    text: 'Past 90 Days'
}, {
    value: 'CURRENT_CALENDAR_YEAR',
    text: 'Current Calendar Year'
}, {
    value: 'PAST_365_DAYS',
    text: 'Past 365 Days'
}, {
    value: 'PRIOR_CALENDAR_YEAR',
    text: 'Prior Calendar Year'
}, {
    value: 'CUSTOM_DATE_RANGE',
    text: 'Custom Date Range'
}];