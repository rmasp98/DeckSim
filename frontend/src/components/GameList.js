import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { getGameList, createSession, setSessionId } from "../store/Actions.js";

export class GameListView extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            this.props.error !== nextProps.error ||
            this.props.isLoaded !== nextProps.isLoaded
        );
    }

    componentDidMount() {
        if (this.props.games.length === 0) {
            this.props.getGameList();
        }
    }

    render() {
        if (this.props.error) {
            return <p>{this.props.error}</p>;
        } else if (!this.props.isLoaded) {
            return <p>Loading</p>;
        } else if (this.props.games.length === 0) {
            return <p>No games available</p>;
        } else {
            return (
                <div>
                    {this.props.games.map(game => (
                        <Game game={game} key={game.name}>
                            <StartGameRedux game={game} />
                        </Game>
                    ))}
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        games: state.GameList.games,
        isLoaded: state.GameList.isLoaded,
        error: state.GameList.error
    };
};
const GameListViewRedux = connect(mapStateToProps, { getGameList })(
    GameListView
);
export default GameListViewRedux;

export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { isExpanded: false };
    }

    render() {
        return (
            <div onClick={this.showButtons}>
                <img
                    src={this.props.game.image}
                    alt={this.props.game.name + " image"}
                />
                <p>{this.props.game.name}</p>
                {this.state.isExpanded && this.props.children}
            </div>
        );
    }

    showButtons = () => {
        this.setState({ isExpanded: true });
    };
}

export class StartGame extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, error: "" };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/game" />;
        }

        return (
            <div>
                <form id="newForm" onSubmit={this.createNewGame}>
                    <input
                        id="newInput"
                        type="text"
                        name="name"
                        onChange={this.handleNewChange}
                    />
                    <input id="newSubmit" type="submit" value="Create" />
                </form>
                <form id="loadForm" onSubmit={this.loadGame}>
                    <select id="loadSelect" name="load">
                        {Object.keys(this.props.game.sessions).map(session => (
                            <option value={session} key={session}>
                                {session}
                            </option>
                        ))}
                    </select>
                    <input id="loadSubmit" type="submit" value="Load" />
                </form>
                {this.state.error && <p>{this.state.error}</p>}
            </div>
        );
    }

    createNewGame = event => {
        event.preventDefault();
        const sessionName = event.target.querySelector("#newInput").value;
        if (sessionName === "") {
            this.setState({ error: "Enter name for new session" });
        } else if (sessionName in this.props.game.sessions) {
            this.setState({ error: "Session already exists" });
        } else {
            this.props.createSession(this.props.game.name, sessionName);
            this.setState({ redirect: true });
        }
    };

    loadGame = event => {
        event.preventDefault();
        const game_id = this.props.game.sessions[
            event.target.querySelector("#loadSelect").value
        ];
        this.props.setSessionId(game_id);
        this.setState({ redirect: true });
    };
}
const StartGameRedux = connect(undefined, { createSession, setSessionId })(
    StartGame
);
