import { namespaceActions } from "../../../../libs";
import namespace from "./namespace";

namespaceActions(namespace, [
    "FETCH_MESSAGES",
    "FETCH_MESSAGES_STARTED",
    "FETCH_MESSAGES_SUCCESS",
    "FETCH_MESSAGES_FAILURE",
    "FETCH_MESSAGES_FINISHED",
]);