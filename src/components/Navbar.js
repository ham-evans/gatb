import React, { Component } from 'react'; 
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'

import "./Navbar.css";

export default class Navbar extends Component { 
  state = {
    isOpen: false
  };

  handleToggle = () => { 
    this.setState({ isOpen: !this.state.isOpen })
  };

  render () {
    return (
      <nav className={this.state.isOpen ? "navbar active" : "navbar"} id="#fullhome">
        <div className="nav-container">
          <HashLink smooth to="#fullhome" className="nav-logo">
            GIRAFFES
          </HashLink>

          <ul className={this.state.isOpen ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <HashLink
                smooth
                to="#about"
                className="nav-links"
              >
                PROJECT
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth 
                to="#thealgorithm"
                className="nav-links"
              >
                TEAM
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth
                to="#diffboids"
                className="nav-links"
              >
                ROADMAP
              </HashLink>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://twitter.com/BOIDS_NFT" }} target="_blank" >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://discord.gg/XvWwuVdQ" }} target="_blank" >
                <FontAwesomeIcon icon={faDiscord} />
              </Link>
            </li>
          </ul>
          <div className="nav-icon" onClick={this.handleToggle}>
            {this.state.isOpen ? <FontAwesomeIcon icon={faTimes} />
              : <FontAwesomeIcon icon={faBars} />
            }
          </div>
        </div>
      </nav>
    );
  }
}