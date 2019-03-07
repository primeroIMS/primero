import { connectRouter } from "connected-react-router/immutable";
import { combineReducers } from "redux-immutable";

export default history =>
  combineReducers({
    router: connectRouter(history)
  });
