import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "../../../../auth/react-auth0-wrapper";

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <header id="tg-header" className="tg-header tg-haslayout">
      <strong className="tg-logo">
        <Link to="/">
          <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="description" width="200px" />
        </Link>
      </strong>
      <div className="tg-rightarea">
        <nav id="tg-addnav" className="tg-addnav">
          <ul>
            <li>
              <Link to="/list-car">add listing</Link>
            </li>
          </ul>
        </nav>
        <nav id="tg-nav" className="tg-nav">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#tg-navigation"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>
          <div className="collapse navbar-collapse" id="tg-navigation">
            <ul>
              <li>
                <Link to="/faq">faq</Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <a href="javascript:void(0)" onClick={() => loginWithRedirect({})}>
                      Sign In
                    </a>
                  </li>
                  <li className="active">
                    <a href="javascript:void(0)" onClick={() => loginWithRedirect({})}>
                      Sign Up
                    </a>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <React.Fragment>
                  <li>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li>
                    <a href="javascript:void(0)" onClick={() => logout()}>
                      Log out
                  </a>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
