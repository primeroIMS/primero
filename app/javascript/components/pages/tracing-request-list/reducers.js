import { reducer as recordListReducer } from "components/record-list";
import NAMESPACE from "./namespace";

export const reducers = { [NAMESPACE]: recordListReducer(NAMESPACE) };
