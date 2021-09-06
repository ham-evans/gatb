import React, { Component } from 'react'; 
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import logo from '../images/logo.png'

import "./Footer.css";

export default class Footer extends Component { 
  render () {
    return (
      <nav className="footer" id="#fullhome">
        <div className="footer-container">
          <HashLink smooth to="#fullhome" className="footer-logo">
            <img className="nav__imgLogo" src={logo} />
          </HashLink>

          <ul className="footer-menu">
            <li className="footer-item">
              <Link className="footer-links" to={{ pathname: "https://twitter.com/BOIDS_NFT" }} target="_blank" >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li className="footer-item">
              <Link className="footer-links" to={{ pathname: "https://discord.gg/XvWwuVdQ" }} target="_blank" >
                <FontAwesomeIcon icon={faDiscord} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}