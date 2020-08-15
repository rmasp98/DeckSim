import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import GameList from "./components/GameList.js";
import Game from "./components/Game";
import Deck from "./components/Deck";
import Cards from "./components/Cards";
import Auth from "./components/Auth";
import store from "./store/Store.js";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <h1>DeckSim</h1>
                <div>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={GameList} />
                            <Route path="/game" component={Game} />
                            <Route path="/deck" component={Deck} />
                            <Route path="/cards" component={Cards} />
                        </Switch>
                    </BrowserRouter>
                </div>
                <Auth />
            </div>
        </Provider>
    );
}

export default App;
