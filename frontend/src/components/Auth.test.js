import React from "react";
import { shallow } from "enzyme";
import sinon from "sinon";

import { Auth } from "./Auth.js";

describe("Auth Component", () => {
    it("renders nothing if refresh is has data", () => {
        const wrapper = shallow(<Auth refresh="refresh" />);
        expect(wrapper.type()).toEqual(null);
    });

    it("submits calls to provided authenticate function with username/password", () => {
        var stub = sinon.stub();
        const wrapper = shallow(<Auth refresh="" authenticate={stub} />);
        wrapper
            .find("input")
            .at(0)
            .simulate("change", {
                target: { name: "username", value: "user1" }
            });
        wrapper
            .find("input")
            .at(1)
            .simulate("change", {
                target: { name: "password", value: "pass" }
            });
        wrapper.find("form").simulate("submit", { preventDefault() {} });
        sinon.assert.calledWith(stub, { username: "user1", password: "pass" });
    });

    it("displays error", () => {
        const wrapper = shallow(<Auth refresh="" error="Some error" />);
        expect(wrapper.text()).toContain("Some error");
    });
});
