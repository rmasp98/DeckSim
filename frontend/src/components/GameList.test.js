import React from "react";
import { mount, shallow } from "enzyme";
import sinon from "sinon";

import { BrowserRouter } from "react-router-dom";

import { GameListView, Game, StartGame } from "./GameList.js";

describe("GameListView", () => {
    it("displays error if error returned from request", () => {
        const wrapper = shallow(
            <GameListView
                error="Some error"
                getGameList={sinon.stub()}
                games={[]}
            />
        );
        expect(wrapper.text()).toEqual("Some error");
    });

    it("displays loading and call getGameList when isloaded is false", () => {
        const stub = sinon.stub();
        const wrapper = shallow(
            <GameListView isLoaded={false} getGameList={stub} games={[]} />
        );
        expect(wrapper.text()).toEqual("Loading");
        sinon.assert.called(stub);
    });

    it("does not call getGameList if games already populated", () => {
        const stub = sinon.stub();
        const games = [
            { name: "game1" },
            { name: "game2" },
            { name: "games3" }
        ];
        const wrapper = shallow(
            <GameListView isLoaded={false} getGameList={stub} games={games} />
        );
        sinon.assert.notCalled(stub);
    });

    it("displays 'no games' if games empty without error", () => {
        const wrapper = shallow(
            <GameListView
                isLoaded={true}
                games={[]}
                getGameList={sinon.stub()}
            />
        );
        expect(wrapper.text()).toEqual("No games available");
    });

    it("populates with games", () => {
        const games = [
            { name: "game1" },
            { name: "game2" },
            { name: "games3" }
        ];
        const wrapper = mount(
            <GameListView
                isLoaded={true}
                games={games}
                getGameList={sinon.stub()}
            />
        );
        for (var i = 0; i < games.length; i++) {
            expect(wrapper.find("Game").at(i).prop("game")).toEqual(games[i]);
        }
    });
});

describe("Game", () => {
    const fakeGame = {
        name: "Test Game 1",
        sessions: { "First Game": 0 },
        image: "http://127.0.0.1/image/games/Test%20Game%201"
    };

    it("populates with game name", () => {
        const wrapper = shallow(<Game game={fakeGame} />);
        expect(wrapper.text()).toContain(fakeGame.name);
    });

    it("creates image with correct src", () => {
        const wrapper = shallow(<Game game={fakeGame} />);
        expect(wrapper.find("img").prop("src")).toEqual(fakeGame.image);
    });

    it("renders StartGame component on click", () => {
        const wrapper = shallow(
            <Game game={fakeGame}>
                <StartGame game={fakeGame} />
            </Game>
        );
        expect(wrapper.exists("StartGame")).toBe(false);
        wrapper.simulate("click");
        expect(wrapper.exists("StartGame")).toBe(true);
    });
});

describe("Load Game for Game Card", () => {
    const fakeGame = {
        name: "Test Game 1",
        sessions: { "First Game": 5, "Second Game": 10 },
        image: "http://127.0.0.1/image/games/Test%20Game%201"
    };

    it("populates load options with sessions", () => {
        const wrapper = shallow(<StartGame game={fakeGame} />);
        expect(wrapper.exists("option")).toBe(true);
        wrapper.find("option").forEach((node, index) => {
            expect(node.prop("value")).toEqual(
                Object.keys(fakeGame.sessions)[index]
            );
        });
    });

    it("calls setSession action and redirects on load", () => {
        const stub = sinon.stub();
        const wrapper = mount(
            <BrowserRouter>
                <StartGame game={fakeGame} setSessionId={stub} />
            </BrowserRouter>
        );

        const select = wrapper.find("select");
        select.instance().value = "First Game";
        wrapper.find("#loadForm").simulate("submit");

        sinon.assert.calledWith(stub, 5);
        expect(wrapper.find("Redirect").prop("to")).toBe("/game");
    });

    it("calls newSession action with entered name", () => {
        const stub = sinon.stub();
        const wrapper = mount(
            <BrowserRouter>
                <StartGame game={fakeGame} createSession={stub} />
            </BrowserRouter>
        );

        wrapper.find("#newInput").instance().value = "New Game";
        wrapper.find("#newForm").simulate("submit");

        sinon.assert.calledWith(stub, fakeGame.name, "New Game");
        expect(wrapper.find("Redirect").prop("to")).toEqual("/game");
    });

    it("prevents newSession if input empty and displays error", () => {
        const stub = sinon.stub();
        const wrapper = mount(
            <StartGame game={fakeGame} createSession={stub} />
        );

        wrapper.find("#newInput").instance().value = "";
        wrapper.find("#newForm").simulate("submit");

        sinon.assert.notCalled(stub);
        expect(wrapper.contains("Redirect")).toBe(false);
        expect(wrapper.contains("Enter name for new session")).toBe(true);
    });

    it("prevents newSession if session already exists and displays error", () => {
        const stub = sinon.stub();
        const wrapper = mount(
            <StartGame game={fakeGame} createSession={stub} />
        );

        wrapper.find("#newInput").instance().value = "First Game";
        wrapper.find("#newForm").simulate("submit");

        sinon.assert.notCalled(stub);
        expect(wrapper.contains("Redirect")).toBe(false);
        expect(wrapper.contains("Session already exists")).toBe(true);
    });
});
