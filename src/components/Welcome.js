import React from 'react';
import "./Welcome.css";
import placeholderG from '../images/placeholderGiraffe.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Link } from "react-router-dom";

export default function Welcome () {
    return (
        <div className="welcome" id="Welcome">
            <div className="welcome__container">
                <h1>Welcome to Giraffes At The Bar</h1> 
                <p>A vibrant NFT community set in the ever-expanding metaverse. Purchase a Giraffe NFT to gain access to exclusive perks! Drop coming soon!</p>
                <p>Sign up for the GATB presale here</p>
                <div className="welcome-linksWrapper">
                    <Link className="welcome-links" to={{ pathname: "https://twitter.com/BOIDS_NFT" }} target="_blank" >
                        <FontAwesomeIcon icon={faTwitter} />
                    </Link>
                    <Link className="welcome-links" to={{ pathname: "https://discord.gg/XvWwuVdQ" }} target="_blank" >
                        <FontAwesomeIcon icon={faDiscord} />
                    </Link>
                </div>
            </div>
            <div className="welcome__imgContainer">
                <img src={placeholderG} />
            </div>
        </div>
    
    );
}
