import { Routes, RouterModule } from "@angular/router";
import { MainLayoutComponent } from "@app/shared/layout/app-layouts/main-layout.component";

export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    data: { pageTitle: "Home" },
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        data: { pageTitle: "Dashboard" },
        loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
      },
      {
        path: "audits",
        children: [
          {
            path: "internal",
            data: { pageTitle: "Audits (Internal)" },
            children: [
              {
                path: "",
                loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
              },
              {
                path: "details/:id",
                data: { pageTitle: "Audit Details" },
                loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
              }
            ]
          },
          {
            path: "external",
            data: { pageTitle: "Audits (External)" },
            children: [
              {
                path: "",
                loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
              },
              {
                path: ":id",
                data: { pageTitle: "Audit Details" },
                loadChildren: "./widget-details/widget-details.module#WidgetDetailsModule"
              }
            ]
          }
        ]
      },
      {
        path: "mystery-shops",
        data: { pageTitle: "Mystery Shops" },
        children: [
          {
            path: "",
            loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
          },
          {
            path: ":id",
            data: { pageTitle: "Shop Details" },
            loadChildren: "./widget-details/widget-details.module#WidgetDetailsModule"
          },
        ]
      },
      {
        path: "surveys",
        children: [
          {
            path: "customer",
            data: { pageTitle: "Surveys (Customer)" },
            children: [
              {
                path: "",
                loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
              },
              {
                path: ":id",
                data: { pageTitle: "Survey Details" },
                loadChildren: "./widget-details/widget-details.module#WidgetDetailsModule"
              },
            ]
          },
          {
            path: "employee",
            data: { pageTitle: "Surveys (Employee)" },
            children: [
              {
                path: "",
                loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
              },
              {
                path: ":id",
                data: { pageTitle: "Survey Details" },
                loadChildren: "./widget-details/widget-details.module#WidgetDetailsModule"
              },
            ]
          },
        ]
      },
      {
        path: "social-media",
        data: { pageTitle: "Social Media" },
        loadChildren: "./widgets-page/widgets-page.module#WidgetsPageModule"
      },
      {
        path: "reports",
        data: { pageTitle: "Reports" },
        loadChildren: "./reports/reports.module#ReportsModule"
      },
      {
        path: "admin",
        data: { pageTitle: "Admin" },
        children: [
          {
            path: "",
            redirectTo: "dashboard-configuration",
            pathMatch: "full"
          },
          {
            path: "dashboard-configuration",
            data: { pageTitle: "Dashboard Management" },
            loadChildren: "./admin/dashboard/dashboard.module#DashboardModule"
          },
          {
            path: "users",
            data: { pageTitle: "User Management" },
            children: [
              {
                path: "",
                loadChildren: "./admin/users/user-listing/user-listing.module#UserListingModule"
              },
              {
                path: "details",
                data: { pageTitle: "User Details" },
                loadChildren: "./admin/users/user-details/user-details.module#UserDetailsModule"
              }
            ]
          },
          {
            path: "locations",
            data: { pageTitle: "Location Management" },
            loadChildren: "./admin/locations/locations.module#LocationsModule"
          }
        ]
      }
    ]
  },
  {
    path: "screen-help",
    data: { pageTitle: "Help Documentation" },
    loadChildren: "./screen-help/screen-help.module#ScreenHelpModule"
  }
];

export const ClientRouting = RouterModule.forChild(routes);