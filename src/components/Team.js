import React from 'react';
import "./Team.css";
import gin from '../images/gin.png';
import beer from '../images/beer.png'
import apollo21 from '../images/Apollo21.png'
import squeebo from '../images/squeebo.png'
import goldenx from '../images/goldenx.png'

export default function Team () {
    return (
        <div className="team" id="team">
            <div className="team__container">
                <h1>About The Team</h1> 
                <p>The founders of this project are two Australians who contemplated opening a real-life bar. However, as constant lockdowns ruined traditional social life, they realised the potential of the metaverse and saw the chance to create a community within the NFT space.</p>
                <p>Giraffes At The Bar was born and is now a passionate venture, with a vision to create value for all giraffe owners and one day open the Giraffe Bar in the metaverse.</p>
            </div>
            <div className="team__imgContainer">
                <div className="team__imgIndividual">
                    <img src={gin} />
                    <figcaption class="caption">Chaz (Gin Giraffe): Founder and Avid Gardener</figcaption>
                </div>
                <div className="team__imgIndividual">
                    <img src={beer} />
                    <figcaption class="caption">Tom (Beer Giraffe): Founder and Fruit Enthusiast/Stacker</figcaption>
                </div>
                <div className="team__imgIndividual">
                    <img src={goldenx} />
                    <figcaption class="caption">GoldenX: Developer</figcaption>
                </div>
                <div className="team__imgIndividual">
                    <img src={squeebo} />
                    <figcaption class="caption">Squeebo: Developer and Geek</figcaption>
                </div>
                <div className="team__imgIndividual">
                    <img src={apollo21} />
                    <figcaption class="caption">Apollo 21: Web Developer and Astronaut</figcaption>
                </div>
            </div>
        </div>
    
    );
}
