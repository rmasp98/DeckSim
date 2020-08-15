import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { reducer } from "./Reducers.js";
import { rootSaga } from "./Generators.js";

// Store
// JWT: {token, refresh}
// ids: {game, deck, stack?, cards:[]?}
// games: [{name, image, sessions:{}}]
// cards: [{name, description, image}]
// hand details?
// request progress

const sageMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sageMiddleware));
sageMiddleware.run(rootSaga);

export default store;
