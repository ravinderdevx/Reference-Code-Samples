import Helpfulink from "../containers/helpfullink/helpfullink";
import ChangePassword from "../containers/account/changepassword";
import Login from "../containers/account/login";
import Home from "../containers/home/index";
import ResourceLibrary from "../containers/resourcelibrary/resourcelibrary";
import Reminders from "../containers/reminders/reminders";
import Agenda from "../containers/agenda/agenda_index";
import AddAgenda from "../containers/agenda/add_agenda";
import StaffLogin from "../containers/account/stafflogin";
import Financial from "../containers/financial/financial";
import CheckIn from "../containers/check-ins/checkins_capture";
import History from "../containers/check-ins/history";
import UploadImage from "../containers/ClientPhoto/upload_image";
import Announcements from "../containers/announcements/announcements";

var appRoutes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    exact: true,
    auth: true,
  },
  {
    path: "/account/changepassword",
    name: "Change Password",
    component: ChangePassword,
    exact: true,
    auth: true,
  },
  {
    path: "/account/login",
    name: "Login",
    component: Login,
    exact: true,
  },
  {
    path: "/HelpFulLinks",
    name: "Help Full Link",
    component: Helpfulink,
    exact: true,
    auth: true,
  },
  {
    path: "/ResourceLibrary",
    name: "Resource Library",
    component: ResourceLibrary,
    exact: true,
    auth: true,
  },
  {
    path: "/Reminder",
    name: "Reminder",
    component: Reminders,
    exact: true,
    auth: true,
  },
  {
    path: "/Financial",
    name: "Financial",
    component: Financial,
    exact: true,
    auth: true,
  },
  {
    path: "/Agenda",
    name: "Agenda",
    component: Agenda,
    exact: true,
    auth: true,
  },
  {
    path: "/Agenda/Add_Agenda",
    name: "AddAgenda",
    component: AddAgenda,
    exact: true,
    auth: true,
  },
  {
    path: "/Account/StaffLogin",
    name: "Staff Login",
    component: StaffLogin,
    exact: true,
  },
  {
    path: "/checkin/capture",
    name: "CheckIn",
    component: CheckIn,
    exact: true,
    auth: true,
  },
  {
    path: "/checkin/history",
    name: "History",
    component: History,
    exact: true,
    auth: true,
  },
  {
    path: "/clientphoto/upload",
    name: "UploadImage",
    component: UploadImage,
    exact: true,
    auth: true,
  },
  {
    path: "/Announcement",
    name: "Announcement",
    component: Announcements,
    exact: true,
    auth: true,
  },
];

export default appRoutes;
