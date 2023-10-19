// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MONTH, QUARTER, WEEK } from "../../insights/constants";

import getGroupTranslator from "./get-group-translator";

export default (groupId, groupedBy, localizeDate) => {
  const groupTranslator = getGroupTranslator(groupedBy);

  switch (groupedBy) {
    case QUARTER:
    case MONTH: {
      const [year, groupKey] = groupId.split("-");

      return `${year}-${groupTranslator(groupKey, localizeDate)}`;
    }
    case WEEK: {
      const [start, end] = groupId.split(" - ");

      return groupTranslator(start, end, localizeDate);
    }
    default:
      return groupTranslator(groupId);
  }
};
