import React, { Component } from "react";
import { connect } from "react-redux";

import { authenticate } from "../store/Actions.js";

import "./Auth.css";

export class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "" };
    }

    render() {
        if (this.props.refresh === "") {
            return (
                <div className="auth_overlay">
                    <div className="auth_popup">
                        <form onSubmit={this.handleSubmit}>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                onChange={this.handleChange}
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={this.handleChange}
                            />
                            <input type="submit" value="Login" />
                            {this.props.error && <p>{this.props.error}</p>}
                        </form>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.authenticate(this.state);
    };
}

const mapStateToProps = state => {
    return {
        refresh: state.JWT.refresh,
        error: state.JWT.error
    };
};

const mapDispatchToProps = { authenticate };

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
