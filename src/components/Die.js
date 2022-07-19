import React from 'react';

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return(
        <div 
        className= "die-box" 
        onClick={props.holdDice}
        style={styles}>
            <h3 className>{props.value}</h3>
        </div>
    )
}
