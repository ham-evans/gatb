import React from 'react';
import "./Welcome.css";
import placeholderG from '../images/placeholderGiraffe.png';

export default function Welcome () {
    return (
        <div className="welcome" id="Welcome">
            <div className="welcome__container">
                <h1>Welcome to Giraffes At The Bar</h1> 
                <p>A vibrant NFT community set in the ever-expanding metaverse. Purchase a Giraffe NFT to gain access to exclusive perks! Drop coming soon!</p>
                <p>Sign up for the GATB presale here</p>
            </div>
            <div className="welcome__imgContainer">
                <img src={placeholderG} />
            </div>
        </div>
    
    );
}
