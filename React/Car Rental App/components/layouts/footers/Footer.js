import React from "react";

const Footer = () => {
  return (
    <footer id="tg-footer" className="tg-footer tg-haslayout">
      <div className="tg-footer-info">
        <div className="container">
          <div className="col-md-8 col-sm-12">
            <div className="row">
              <div className="tg-footer-infobox">
                <div className="row">
                  <div className="col-md-6 col-sm-6">
                    <div className="tg-fbox">
                      <strong className="tg-logo">
                        <a href="#">
                          <img src="images/logo2.png" alt="auto search" />
                        </a>
                      </strong>
                      <div className="tg-description">
                        <p>
                          Sed do eiusmod tempoar inont ut labore agua enimad it
                          minim veniam nostrud eation ullamco.
                        </p>
                      </div>
                      <ul>
                        <li>
                          <i className="fa fa-home" />
                          <address>
                            123 Eccles Old Road, New Salford Road, East London,
                            Uk, M6 7AF
                          </address>
                        </li>
                        <li>
                          <i className="fa fa-envelope-o" />
                          <a href="info@company.com">info@company.com</a>
                        </li>
                        <li>
                          <i className="fa fa-phone" />
                          <span>+44 123 456 788 - 9</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <div className="tg-fbox">
                      <div className="tg-border-heading">
                        <h3>By top Make</h3>
                      </div>
                      <ul>
                        <li>
                          <a href="#">Alfa Romeo</a>
                        </li>
                        <li>
                          <a href="#">Koenigsegg</a>
                        </li>
                        <li>
                          <a href="#">Lamborghini</a>
                        </li>
                        <li>
                          <a href="#">Mercedes-Benz</a>
                        </li>
                        <li>
                          <a href="#">Volkswagen</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <div className="tg-fbox">
                      <div className="tg-border-heading">
                        <h3>by top cities</h3>
                      </div>
                      <ul>
                        <li>
                          <a href="#">Manchester</a>
                        </li>
                        <li>
                          <a href="#">Bristol</a>
                        </li>
                        <li>
                          <a href="#">Liverpool</a>
                        </li>
                        <li>
                          <a href="#">Nottingham</a>
                        </li>
                        <li>
                          <a href="#">Glasgow</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="row">
              <div className="tg-newsletter tg-curvedark">
                <div className="tg-border-heading">
                  <h3>subscribe Newsletter</h3>
                </div>
                <div className="tg-description">
                  <p>
                    Consectetur adipisicing elit sed doings eiuod tempor
                    incididunt dolore magna aliqua.
                  </p>
                </div>
                <form className="tg-form-newsletter">
                  <fieldset>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <button className="tg-btn" type="submit" name="submit">
                      <span>submit</span>
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tg-footerbar">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <span className="tg-copyright">
                &copy; 2015 | All Rights Reserved
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
