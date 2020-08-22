import React, { Fragment } from "react";

import logoImage from "../../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import NotificationDropdown from "../../../shared/components/ui/notification-dropdown/notification-dropdown";

const AppHeader = ({
  auth,
  onLogout,
  showMenu,
  onToggleMenu,
  Notifications,
}) => {
  return (
    <Fragment>
      <nav className="navbar header-navbar pcoded-header iscollapsed fixed-top">
        <div className="navbar-wrapper">
          <div className="navbar-logo">
            <Link to="/">
              <img className="img-fluid" src={logoImage} alt="Theme-Logo" />
            </Link>
            <button className="link-button mobile-options">
              <i className="feather icon-more-horizontal"></i>
            </button>
          </div>
          <div className="navbar-container container-fluid">
            <ul className="nav-left">
              <li>
                <button
                  className="link-button mobile-menu"
                  id="mobile-collapse"
                  onClick={onToggleMenu}
                >
                  <i className="fa fa-bars"></i>
                </button>
              </li>
            </ul>
            <ul className="nav-right ml-auto">
              <li className="header-notification">
                <NotificationDropdown />
              </li>
              <li className="user-profile">
                <span>
                  {auth.user.FirstName + " " + auth.user.LastName}{" "}
                  <small>Phase : {auth.user.PhaseDesc}</small>
                </span>
              </li>
              <li className="user-logout">
                <button
                  className="link-button mobile-menu"
                  id="mobile-collapse"
                  onClick={onLogout}
                >
                  <i className="fa fa-sign-out"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* sidebar */}
      <div className={`br-sideleft ps ${showMenu ? "hide" : ""}`}>
        <ul className="br-sideleft-menu">
          <li>
            <NavLink to={`/`} exact>
              <i className="fa fa-home" aria-hidden="true"></i>
              <span className="menu-item-label">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/Financial`}>
              <i className="fa fa-usd" aria-hidden="true"></i>
              <span className="menu-item-label">Accounts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/Agenda`}>
              <i className="fa fa-calendar"></i>
              <span className="menu-item-label">Agendas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/Announcement`}>
              <i className="fa fa-bullhorn" aria-hidden="true"></i>
              <span className="menu-item-label">Announcements</span>
            </NavLink>
          </li>
          <li>
            <NavLink className="br-menu-link" to={`/HelpFulLinks`}>
              <i className="fa fa-link"></i>
              <span className="menu-item-label">Helpful Links</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/Reminder`}>
              <i className="fa fa-check-square-o"></i>
              <span className="menu-item-label">Reminders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/ResourceLibrary`}>
              <i className="fa fa-file-o" aria-hidden="true"></i>
              <span className="menu-item-label">Resource Library</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export default AppHeader;
