import {
    put,
    call,
    select,
    retry,
    take,
    takeLeading,
    takeLatest
} from "redux-saga/effects";

import * as Actions from "./Actions.js";
import * as Api from "../Api.js";

// generators
// api request generators (check refresh time and if passed call refresh generator directly)

export function* authenticateSaga(action) {
    try {
        const jwt = yield call(
            Api.fetchAuth,
            action.payload.username,
            action.payload.password
        );
        localStorage.setItem("refresh", jwt.refresh);
        yield put(Actions.setJWT(jwt.token, jwt.refresh));
    } catch {
        yield put(Actions.triggerAuth("Username or password was incorrect"));
    }
}

export const getRefreshFromStore = state => state.JWT.refresh;
export function* refreshSaga() {
    try {
        const refresh = yield select(getRefreshFromStore);
        const response = yield retry(3, 100, Api.fetchNewToken, refresh);
        yield put(Actions.setToken(response.token));
        return response.token;
    } catch {
        yield put(Actions.triggerAuth());
        const jwt = yield take(Actions.SET_JWT);
        return jwt.payload.token;
    }
}

function getTokenExpiry(token) {
    try {
        const data = token.split(".")[1];
        const json = JSON.parse(atob(data));
        return json.exp * 1000; //Date.now is in milliseconds
    } catch {
        return 0;
    }
}

export const getTokenFromStore = state => state.JWT.token;
export function* getToken() {
    var token = yield select(getTokenFromStore);
    if (getTokenExpiry(token) < Date.now()) {
        token = yield* refreshSaga();
    }
    return token;
}

export function* getGameListSaga() {
    try {
        const token = yield* getToken();
        const games = yield call(Api.fetchGames, token);
        yield put(Actions.setGameList(games));
    } catch (error) {
        yield put(Actions.setGameList([], error.message));
    }
}

export function* createSessionSaga(action) {
    try {
        const token = yield* getToken();
        const session_id = yield call(
            Api.createSession,
            action.payload.game,
            action.payload.session,
            token
        );
        yield put(Actions.setSessionId(session_id));
    } catch (e) {
        yield put(Actions.setSessionId(-1));
    }
}

export function* getSessionSaga(action) {
    try {
        const token = yield* getToken();
        const { game, session, decks } = yield call(
            Api.fetchSession,
            action.payload,
            token
        );
        yield put(Actions.initSession(game, session, decks));
    } catch (e) {
        yield put(Actions.initSession({ error: e.message }));
    }
}

export function* rootSaga() {
    yield takeLeading(Actions.AUTHENTICATE, authenticateSaga);
    yield takeLeading(Actions.REFRESH_TOKEN, refreshSaga);
    yield takeLatest(Actions.GET_GAME_LIST, getGameListSaga);
    yield takeLeading(Actions.CREATE_SESSION, createSessionSaga);
    yield takeLatest(Actions.SET_SESSION_ID, getSessionSaga);
}
