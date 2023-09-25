import { getAppResources } from "./components/user/action-creators";
import configureStore from "./store";

function appInit() {
  const store = configureStore();

  store.dispatch(getAppResources);

  return { store };
}

export default appInit;
