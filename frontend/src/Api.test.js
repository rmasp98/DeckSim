const fetchMock = require("fetch-mock-jest");
import sinon from "sinon";

import * as Api from "./Api.js";

describe("API requests", () => {
    it("can fetch list of games", () => {
        fetchMock.get("/api/games", {});
        Api.fetchGames("token");
        expect(fetchMock.lastOptions()).toEqual({
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token"
            },
            method: "GET"
        });
        fetchMock.mockReset();
    });

    it("throws Auth error if authentication fails", async () => {
        fetchMock.get("/api/games", 401);
        try {
            await Api.fetchGames("token");
            fail("Error not thrown");
        } catch (e) {
            expect(e).toBeInstanceOf(Api.AuthError);
        }
        fetchMock.mockReset();
    });

    it("throws generic error for any other problems", async () => {
        fetchMock.get("/api/games", 400);
        try {
            await Api.fetchGames("token");
            fail("Error not thrown");
        } catch (e) {
            expect(e.message).toEqual("Request error");
        }
        fetchMock.mockReset();
    });

    it("can create a new session", () => {
        fetchMock.post("/api/sessions", {});
        Api.createSession("game", "session", "token");
        expect(fetchMock.lastOptions()).toEqual({
            body: '{"game":"game","session":"session"}',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token"
            },
            method: "POST"
        });
        fetchMock.mockReset();
    });

    it("can authenticate user", () => {
        fetchMock.post("api/token", {});
        Api.fetchAuth("user", "password");
        expect(fetchMock.lastOptions()).toEqual({
            body: '{"username":"user","password":"password"}',
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        fetchMock.mockReset();
    });

    it("can refresh token", () => {
        fetchMock.post("api/token/refresh", {});
        Api.fetchNewToken("refresh");
        expect(fetchMock.lastOptions()).toEqual({
            body: '{"refresh":"refresh"}',
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        fetchMock.mockReset();
    });

    it("can fetch session data", () => {
        fetchMock.get("api/sessions/5", {});
        Api.fetchSession(5, "token");
        expect(fetchMock.lastOptions()).toEqual({
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token"
            },
            method: "GET"
        });
        fetchMock.mockReset();
    });
});
