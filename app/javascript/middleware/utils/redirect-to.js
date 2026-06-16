import { push } from "connected-react-router";

export default (store, path) => {
  return store.dispatch(push(path));
};
