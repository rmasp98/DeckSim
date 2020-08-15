import { JWT, GameList, Ids, Session } from "./Reducers.js";
import * as Actions from "./Actions.js";

describe("JWT reducer", () => {
    it("unsets JWT values on TRIGGER_AUTH", () => {
        const action = Actions.triggerAuth("Test");
        expect(
            JWT({ token: "token", refresh: "refresh", error: "" }, action)
        ).toEqual({ token: "", refresh: "", error: "Test" });
    });

    it("updates entire JWT with new values", () => {
        const action = Actions.setJWT("token", "refresh");
        expect(JWT({ token: "", refresh: "" }, action)).toEqual({
            token: "token",
            refresh: "refresh"
        });
    });

    it("updates token when refreshing", () => {
        const action = Actions.setToken("New token");
        expect(JWT({ token: "token", refresh: "refresh" }, action)).toEqual({
            token: "New token",
            refresh: "refresh"
        });
    });

    it("retrieves refresh from localStorage", () => {
        localStorage.setItem("refresh", "refresh");
        const action = { type: "NONE" };
        expect(JWT(undefined, action)).toEqual({
            token: "",
            refresh: "refresh",
            error: ""
        });
    });
});

describe("GameList reducer", () => {
    it("resets game list and sets isLoaded on GET_GAME_LIST", () => {
        const action = Actions.getGameList();
        expect(
            GameList(
                { games: [1, 2, 3], isLoaded: true, error: "Some error" },
                action
            )
        ).toEqual({ games: [], isLoaded: false, error: "" });
    });

    it("updates games and isloaded if successful", () => {
        const action = Actions.setGameList([1, 2, 3]);
        expect(
            GameList({ games: [], isLoaded: false, error: "" }, action)
        ).toEqual({ games: [1, 2, 3], isLoaded: true, error: "" });
    });

    it("updates error and isLoaded if unsuccessful", () => {
        const action = Actions.setGameList([1, 2, 3], "Some error");
        expect(
            GameList({ games: [1, 2, 3], isLoaded: true, error: "" }, action)
        ).toEqual({ games: [], isLoaded: false, error: "Some error" });
    });
});

describe("Ids reducer", () => {
    it("can set the session id", () => {
        const action = Actions.setSessionId(12);
        expect(Ids(undefined, action)).toEqual({
            session: 12,
            deck: -1,
            cards: []
        });
    });
});

describe("SessionData reducer", () => {
    it("can initialise session data", () => {
        const action = Actions.initSession("game", "session", []);
        expect(Session(undefined, action)).toEqual({
            game: "game",
            session: "session",
            decks: []
        });
    });

    it("only sets error if error has value", () => {
        const action = Actions.initSession("game", "session", [], "Some error");
        expect(Session(undefined, action)).toEqual({ error: "Some error" });
    });

    it("sets an error if any data is missing", () => {
        const action = Actions.initSession();
        expect(Session(undefined, action)).toEqual({
            error: "Missing session data"
        });
    });
});
