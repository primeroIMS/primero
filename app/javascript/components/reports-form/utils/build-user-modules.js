// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default userModules => {
  if (userModules.isEmpty()) {
    return [];
  }

  return userModules.reduce((current, prev) => {
    current.push({ id: prev.get("unique_id"), display_text: prev.get("name") });

    return current;
  }, []);
};
