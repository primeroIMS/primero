import { namespaceActions } from "../../../../libs";
import namespace from "./namespace";

export default namespaceActions(namespace, [
    "FETCH_MESSAGES",
    "FETCH_MESSAGES_STARTED",
    "FETCH_MESSAGES_SUCCESS",
    "FETCH_MESSAGES_FAILURE",
    "FETCH_MESSAGES_FINISHED",
]);