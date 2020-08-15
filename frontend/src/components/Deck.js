import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Deck extends Component {
    render() {
        return (
            <div>
                <h2>Deck</h2>
                <Stack name="Main" />
            </div>
        );
    }
}

export default Deck;

class Stack extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <NavLink to="/cards">
                    <button type="button" onClick={this.draw}>Draw</button>
                </NavLink>
                <button type="button">Shuffle</button>
                <button type="button">View</button>
            </div>
        );
    }

    draw() {
        console.log("Draw")
    }

}
