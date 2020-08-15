import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Cards extends Component {
    render() {
        return (
            <div>
                <h2>Cards</h2>
                <NavLink to="/">home</NavLink>
            </div>
        );
    }
}

export default Cards;
