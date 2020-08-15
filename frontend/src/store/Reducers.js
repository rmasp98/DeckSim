import { combineReducers } from "redux";

import * as Actions from "./Actions.js";

export function JWT(
    state = { token: "", refresh: localStorage.getItem("refresh"), error: "" },
    action
) {
    switch (action.type) {
        case Actions.TRIGGER_AUTH:
            return { token: "", refresh: "", error: action.payload };
        case Actions.SET_JWT:
            return {
                token: action.payload.token,
                refresh: action.payload.refresh,
                expiry: action.payload.expiry
            };
        case Actions.SET_TOKEN:
            return Object.assign({}, state, {
                token: action.payload.token
            });
        default:
            return state;
    }
}

export function GameList(
    state = { games: [], isLoaded: false, error: "" },
    action
) {
    switch (action.type) {
        case Actions.GET_GAME_LIST:
            return { games: [], isLoaded: false, error: "" };
        case Actions.SET_GAME_LIST:
            if (action.payload.error) {
                return {
                    games: [],
                    isLoaded: false,
                    error: action.payload.error
                };
            } else {
                return {
                    games: action.payload.games,
                    isLoaded: true,
                    error: ""
                };
            }
        default:
            return state;
    }
}

export function Ids(state = { session: -1, deck: -1, cards: [] }, action) {
    switch (action.type) {
        case Actions.SET_SESSION_ID:
            return Object.assign({}, state, { session: action.payload });
        default:
            return state;
    }
}

export function Session(state = { error: "Session not retrieved" }, action) {
    switch (action.type) {
        case Actions.INIT_SESSION:
            const data = action.payload;
            if (data.error) {
                return { error: action.payload.error };
            } else if (!data.game || !data.session || !data.decks) {
                return { error: "Missing session data" };
            } else {
                return {
                    game: action.payload.game,
                    session: action.payload.session,
                    decks: action.payload.decks
                };
            }
        default:
            return state;
    }
}

export const reducer = combineReducers({
    JWT,
    GameList,
    Ids,
    Session
});
