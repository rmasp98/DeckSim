import { call, put, select, retry, take } from "redux-saga/effects";
import sinon from "sinon";

import * as Sagas from "./Generators.js";
import * as Actions from "./Actions.js";
import * as Api from "../Api.js";

describe("authenticateSaga", () => {
    it("calls fetchAuth and puts repsonse in redux", () => {
        const action = Actions.authenticate({
            username: "username",
            password: "password"
        });
        const gen = Sagas.authenticateSaga(action);
        expect(gen.next().value).toEqual(
            call(Api.fetchAuth, "username", "password")
        );
        expect(gen.next({ token: "token", refresh: "refresh" }).value).toEqual(
            put(Actions.setJWT("token", "refresh"))
        );
        expect(gen.next().done).toEqual(true);
    });

    it("stores the refresh token in local storage", () => {
        const action = Actions.authenticate({
            username: "username",
            password: "password"
        });
        const gen = Sagas.authenticateSaga(action);
        gen.next();
        gen.next({ token: "token", refresh: "refresh" });
        expect(localStorage.getItem("refresh")).toEqual("refresh");
    });

    it("trigger authentication if error raised and waits for token", () => {
        const action = Actions.authenticate("username", "password");
        const gen = Sagas.authenticateSaga(action);
        gen.next();
        expect(gen.throw().value).toEqual(
            put(Actions.triggerAuth("Username or password was incorrect"))
        );
        expect(gen.next().done).toEqual(true);
    });
});

describe("refreshSaga", () => {
    it("calls fetchNewToken and puts in store", () => {
        const gen = Sagas.refreshSaga();
        expect(gen.next().value).toMatchObject(
            select(Sagas.getRefreshFromStore)
        );
        expect(gen.next("refresh").value).toEqual(
            retry(3, 100, Api.fetchNewToken, "refresh")
        );
        expect(gen.next({ token: "token" }).value).toEqual(
            put(Actions.setToken("token"))
        );
        expect(gen.next().done).toEqual(true);
    });

    it("trigger authentication if error raised", () => {
        const gen = Sagas.refreshSaga();
        gen.next();
        expect(gen.throw().value).toEqual(put(Actions.triggerAuth()));
        expect(gen.next().value).toEqual(take(Actions.SET_JWT));
        expect(gen.next(Actions.setJWT("token", "refresh")).value).toEqual(
            "token"
        );
    });
});

const validToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTk5fQ.Signature";
function processValidToken(generator) {
    expect(generator.next().value).toEqual(select(Sagas.getTokenFromStore));
    return generator.next(validToken).value;
}

describe("getToken", () => {
    it("can retrieve token from store", () => {
        const gen = Sagas.getToken();
        expect(gen.next().value).toEqual(select(Sagas.getTokenFromStore));
        expect(gen.next(validToken).value).toEqual(validToken);
    });

    it("can retrieve new token if expired", () => {
        const invalidToken =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjB9.Signature";
        const gen = Sagas.getToken();
        gen.next(); // getTokenFromStore
        gen.next(invalidToken); // getRefreshFromStore
        gen.next("refreshToken"); // fetch new access token
        gen.next({ token: validToken }); // put token in store
        expect(gen.next().value).toEqual(validToken);
    });
});

describe("getGameListSaga", () => {
    it("calls fetchGames and puts in store", () => {
        const games = [{ name: "test1" }, { name: "test2" }];
        const gen = Sagas.getGameListSaga();
        const next = processValidToken(gen);
        expect(next).toEqual(call(Api.fetchGames, validToken));
        expect(gen.next(games).value).toEqual(put(Actions.setGameList(games)));
        expect(gen.next().done).toEqual(true);
    });

    it("puts error in store if request fails", () => {
        const gen = Sagas.getGameListSaga();
        gen.next();
        gen.next(validToken);
        expect(gen.throw(new Error("Some error")).value).toEqual(
            put(Actions.setGameList([], "Some error"))
        );
        expect(gen.next().done).toEqual(true);
    });
});

describe("createSessionSaga", () => {
    it("calls createSession and sets game in store", () => {
        const action = Actions.createSession("game", "session");
        const gen = Sagas.createSessionSaga(action);
        const next = processValidToken(gen);
        expect(next).toEqual(
            call(Api.createSession, "game", "session", validToken)
        );
        expect(gen.next(5).value).toEqual(put(Actions.setSessionId(5)));
        expect(gen.next().done).toEqual(true);
    });

    it("sets game id to -1 if fetch fails", () => {
        const action = Actions.createSession("game", "session");
        const gen = Sagas.createSessionSaga(action);
        processValidToken(gen);
        expect(gen.throw().value).toEqual(put(Actions.setSessionId(-1)));
        expect(gen.next().done).toEqual(true);
    });
});

describe("getSessionSaga", () => {
    it("calls fetchSession and sets session data in store", () => {
        const action = Actions.setSessionId(5);
        const gen = Sagas.getSessionSaga(action);
        const next = processValidToken(gen);
        expect(next).toEqual(call(Api.fetchSession, 5, validToken));
        expect(
            gen.next({ game: "game", session: "session", decks: [] }).value
        ).toEqual(put(Actions.initSession("game", "session", [])));
        expect(gen.next().done).toEqual(true);
    });

    it("sets error in session data if fetch fails", () => {
        const action = Actions.setSessionId(10);
        const gen = Sagas.getSessionSaga(action);
        processValidToken(gen);
        expect(gen.throw(new Error("Some error")).value).toEqual(
            put(Actions.initSession({ error: "Some error" }))
        );
        expect(gen.next().done).toEqual(true);
    });
});
