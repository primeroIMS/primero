import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, ["NETWORK_STATUS", "SERVER_STATUS"]);
