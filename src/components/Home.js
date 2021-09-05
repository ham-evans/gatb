import React, { Component } from 'react'; 
import bgGiraffe from '../images/bgGiraffe.png';
import './Home.css'

export default class Home extends Component { 
    render () {
        return (
            <div className="home" id="#home">
                <div className="homeBg" style={{ backgroundImage: `url(${bgGiraffe})` }}>
                    
                </div>
            </div>
        );
    }
}