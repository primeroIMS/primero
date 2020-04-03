import React from "react";

import useI18n from "./use-i18n";

export default Component => {
  const I18nComponent = props => {
    const i18nHook = useI18n();

    return <Component {...props} i18n={i18nHook} />;
  };

  I18nComponent.displayName = `${Component.displayName || "Anonymous"}WithI18n`;

  return I18nComponent;
};
