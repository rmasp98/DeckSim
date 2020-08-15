import React, { Component } from "react";
import { NavLink } from "react-router-dom";

// Check if this,props.location.state.session_id exists, if so update this.state.session_id
// If session_id and the above does not exist, redirect to home

class GameView extends Component {
    constructor(props) {
        super(props);
        this.state = { game_id: -1 };
    }

    render() {
        return (
            <div>
                <h2>Game {this.state.game_id}</h2>
                <NavLink to="/deck">deck</NavLink>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({ game_id: this.props.location.state.game_id });
        }
    }
}

export default GameView;
