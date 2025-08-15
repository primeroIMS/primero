// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

export default fields => {
  const fieldUniq = new Set();

  return fields.reduce((acc, field) => {
    const name = field.get("name");

    if (!fieldUniq.has(name) && !field.get("disabled") && field.get("visible")) {
      fieldUniq.add(name);
      const displayName = field.get("display_name");

      acc.push(displayName);
    }

    return acc;
  }, []);
};
