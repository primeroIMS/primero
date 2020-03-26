import { dataToJS } from "../../../../libs";

import { USER_NAME } from "./components/filters/constants";

export const searchableUsers = data => {
  const users = dataToJS(data);

  return users.reduce(
    (acc, user) => [
      ...acc,
      { id: user.user_name, display_name: user.user_name }
    ],
    []
  );
};

export const buildAuditLogsQuery = data => {
  return Object.entries(data).reduce((acc, obj) => {
    const [key, value] = obj;

    if (key === USER_NAME) {
      return { ...acc, [USER_NAME]: value.id };
    }

    return { ...acc, [key]: value };
  }, {});
};
