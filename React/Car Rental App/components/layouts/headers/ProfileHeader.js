import React, { useEffect, Fragment } from "react";
import Swiper from "swiper";
import { NavLink } from "react-router-dom";

const ProfileHeader = ({ match, user }) => {
  useEffect(() => {
    const swiper = new Swiper("#tg-dashboardlist-slider", {
      slidesPerView: 8,
      prevButton: ".tg-prev",
      nextButton: ".tg-next",
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 568px
        568: { slidesPerView: 1 },
        // when window width is <= 767px
        767: { slidesPerView: 3 },
        // when window width is <= 991px
        991: { slidesPerView: 4 },
        // when window width is <= 1199px
        1199: { slidesPerView: 5 },
        // when window width is <= 1199px
        1280: { slidesPerView: 6 }
      }
    });
  }, []);

  const { hasVehicle } = user;

  return (
    <div className="tg-dashboardslider-area tg-haslayout">
      <div
        id="tg-dashboardlist-slider"
        className="tg-dashboard-list tg-dashboardlist-slider tg-haslayout"
      >
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <NavLink exact to={match.path}>
              <div className="tg-border-heading">
                <i className="fa fa-user" />
              </div>
              <span>profile</span>
            </NavLink>
          </div>
          {
            hasVehicle ?
              (
                <Fragment>
                  <div className="swiper-slide">
                    <NavLink to={`${match.path}/listing`}>
                      <div className="tg-border-heading">
                        <i className="fa fa-list-ul" />
                      </div>
                      <span>vehicles</span>
                    </NavLink>
                  </div>
                  <div className="swiper-slide">
                    <NavLink to={`${match.path}/performance`}>
                      <div className="tg-border-heading">
                        <i className="fa fa-line-chart" />
                      </div>
                      <span>performance</span>
                    </NavLink>
                  </div>
                  <div className="swiper-slide">
                    <NavLink to={`${match.path}/reviews`}>
                      <div className="tg-border-heading">
                        <i className="fa fa-star" />
                      </div>
                      <span>reviews</span>
                    </NavLink>
                  </div>

                  <div className="swiper-slide">
                    <NavLink to={`${match.path}/earnings`}>
                      <div className="tg-border-heading">
                        <i className="fa fa-money" />
                      </div>
                      <span>earnings</span>
                    </NavLink>
                  </div>

                  <div className="swiper-slide">
                    <NavLink to={`${match.path}/settings`}>
                      <div className="tg-border-heading">
                        <i className="fa fa-cog" />
                      </div>
                      <span>settings</span>
                    </NavLink>
                  </div>
                </Fragment>
              ) :
              <div className="swiper-slide">
                <NavLink to={`${match.path}/trips`}>
                  <div className="tg-border-heading">
                    <i className="fa fa-list-ul" />
                  </div>
                  <span>trips</span>
                </NavLink>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
