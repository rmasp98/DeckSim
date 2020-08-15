///////////////////////// Authentication Actions ///////////////////////////////
// This will open auth view to enter usrname and password
export const TRIGGER_AUTH = "TRIGGER_AUTH";
export function triggerAuth(error) {
    return { type: TRIGGER_AUTH, payload: error };
}

// Called by auth view to authenticate to API
export const AUTHENTICATE = "AUTHENTICATE";
export function authenticate({ username, password }) {
    return {
        type: AUTHENTICATE,
        payload: { username: username, password: password }
    };
}

// Called after authenticate has recieved tokens
export const SET_JWT = "SET_JWT";
export function setJWT(token, refresh) {
    return { type: SET_JWT, payload: { token: token, refresh: refresh } };
}

// Called when token expires to get new access token
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export function refreshToken() {
    return { type: REFRESH_TOKEN };
}

// Called after refreshToken recieves a new access token
export const SET_TOKEN = "SET_TOKEN";
export function setToken(token) {
    return { type: SET_TOKEN, payload: { token: token } };
}

//////////////////////// Game Actions /////////////////////////////////////
// fetch game list from API
export const GET_GAME_LIST = "GET_GAME_LIST";
export function getGameList() {
    return { type: GET_GAME_LIST };
}

// Called by getGameList once it recieved response. Either gives game list of error
export const SET_GAME_LIST = "SET_GAME_LIST";
export function setGameList(games, error) {
    return { type: SET_GAME_LIST, payload: { games: games, error: error } };
}

// Called by GameList view. Calls api to create new session and then sets game id
export const CREATE_SESSION = "CREATE_SESSION";
export function createSession(game, sessionName) {
    return {
        type: CREATE_SESSION,
        payload: { game: game, session: sessionName }
    };
}

// Sets game displayed in Game view. Will clear game in store and fetch new game data
export const SET_SESSION_ID = "SET_SESSION_ID";
export function setSessionId(id) {
    return { type: SET_SESSION_ID, payload: id };
}

// Sets all the session data such as names, decks and dice available
export const INIT_SESSION = "INIT_SESSION";
export function initSession(game, session, decks, error) {
    return {
        type: INIT_SESSION,
        payload: { game: game, session: session, decks: decks, error: error }
    };
}
