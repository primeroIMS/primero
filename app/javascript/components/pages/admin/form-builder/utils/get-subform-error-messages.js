import { List } from "immutable";

export default (errors, i18n) =>
  errors
    .map(errorParent =>
      errorParent.get("errors")?.map(error => {
        const message = error.get("message");
        const messageWithKeys = List.isList(message);

        if (!messageWithKeys) {
          return message;
        }

        return i18n.t(message.first(), {
          [error.get("detail")]: error.get("value")
        });
      })
    )
    .filter(error => Boolean(error))
    .flatten();
