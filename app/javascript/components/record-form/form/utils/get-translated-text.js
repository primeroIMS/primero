// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (displayText, i18n) => {
  return displayText instanceof Object ? displayText?.[i18n.locale] || "" : displayText;
};
