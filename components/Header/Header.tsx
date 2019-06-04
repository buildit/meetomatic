
import * as React from "react";

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <header>
          <div>
            <div className="grav-c-page-header__logo">
              <a href="#">Meet-o-matic</a>
            </div>
            <button className="grav-c-toggle-menu" type="button" aria-pressed="false" aria-label="Toggle navigation menu">
              <span className="grav-c-toggle-menu__icon"></span>
            </button>
            <nav className="grav-c-nav-menu">
              <ul>
                <li>
                  <a className="grav-c-nav-link" href="#">👤 Username Here</a>
                </li>

                <li>
                  <a className="grav-c-nav-link" href="#">🔚 Sign out</a>
                </li>

              </ul>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}
