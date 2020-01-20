import { namespaceActions } from "../../../libs";

import NAMESPACE from "./namespace";

const actions = namespaceActions(NAMESPACE, ["EXPORT"]);

export default {
  ...actions
};
