export async function fetchAuth(username, password) {
    return request({
        method: "POST",
        url: "/api/token",
        body: { username: username, password: password }
    }).then(data => {
        return {
            token: data.access,
            refresh: data.refresh
        };
    });
}

export async function fetchNewToken(refresh) {
    return request({
        method: "POST",
        url: "/api/token/refresh",
        body: { refresh: refresh }
    }).then(data => {
        return {
            token: data.access
        };
    });
}

export async function fetchGames(token) {
    return request({ method: "GET", url: "/api/games", token: token }).then(
        data => data.games
    );
}

export async function createSession(game, sessionName, token) {
    return request({
        method: "POST",
        url: "/api/sessions",
        token: token,
        body: {
            game: game,
            session: sessionName
        }
    }).then(data => {
        return {
            game_id: data.game_id
        };
    });
}

export async function fetchSession(sessionId, token) {
    return request({
        method: "GET",
        url: "/api/sessions/" + sessionId,
        token: token
    });
}

export class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
}

async function request({ method, url, token, body = {}, extraOptions = {} }) {
    var headers = { "Content-Type": "application/json" };
    if (token) {
        headers.Authorization = "Bearer " + token;
    }
    var options = { method: method, headers: headers };
    if (Object.keys(body).length !== 0) {
        options.body = JSON.stringify(body);
    }
    return fetch(url, options).then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            throw new AuthError("Token authentication failed");
        } else {
            throw new Error("Request error");
        }
    });
}
