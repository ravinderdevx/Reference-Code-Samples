import Home from "../components/home/Home";
import VehicleListPage from "../components/vehicles/VehicleListPage";
import VehicleDetailsPage from "../components/vehicles/VehicleDetailsPage";
import ListCarPage from "../components/listing/ListCarPage";
import FAQPage from "../components/faq/FAQPage";
import BookingPage from "../components/booking/BookingPage";
import CompareVehicles from "../components/compare/CompareVehicles";
import Profile from "../components/user/profile/ProfilePage";
import DashboardPage from "../components/user/dashboard/DashboardPage";
import ListingPage from "../components/user/profile/ListingPage";
import ProfileLayout from "../components/common/layouts/ProfileLayout";
import profileRoutes from "./profileRoutes";

const appRoutes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    exact: true
  },
  {
    path: "/faq",
    name: "FAQ",
    component: FAQPage
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: VehicleListPage
  },
  {
    path: "/vehicledetails/:vehicleId",
    name: "Vehicle Details",
    component: VehicleDetailsPage
  },
  {
    path: "/booking/:vehicleId",
    name: "Booking",
    component: BookingPage,
    auth: true
  },
  {
    path: "/compare",
    name: "Compare",
    component: CompareVehicles
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    auth: true
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileLayout,
    routes: profileRoutes,
    auth: true
  },
  {
    path: "/list-car",
    name: "New Listing",
    component: ListCarPage,
    exact: true,
    auth: true
  },
  {
    path: "/list-car/:vehicleId",
    name: "Update Listing",
    component: ListCarPage,
    auth: true
  },
];

export default appRoutes;
