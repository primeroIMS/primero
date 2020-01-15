import PropTypes from "prop-types";
import React, { useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fromJS } from "immutable";

import { setLocale } from "./action-creators";
import { getLocales, getLocale } from "./selectors";

const Context = createContext();

const I18nProvider = ({ children }) => {
  const locale = useSelector(state => getLocale(state));
  const locales = useSelector(state => getLocales(state));

  const dispatch = useDispatch();

  const dir = l => {
    switch (l) {
      case "ar":
      case "ar-LB":
      case "ku":
      case "zh":
        return "rtl";
      default:
        return "ltr";
    }
  };

  const changeLocale = value => {
    window.I18n.locale = value;

    dispatch(setLocale({ locale: value, dir: dir(value) }));
  };

  const getI18nStringFromObject = i18nObject => {
    if (i18nObject instanceof Object) {
      return i18nObject?.[locale];
    }

    return i18nObject;
  };

  const translateLocales = () =>
    locales.reduce((prev, value) => {
      const result = prev.push(
        fromJS({ id: value, display_text: window.I18n.t(`home.${value}`) })
      );

      return result;
    }, fromJS([]));

  return (
    <Context.Provider
      value={{
        locale,
        applicationLocales: translateLocales(),
        ...window.I18n,
        changeLocale,
        getI18nStringFromObject
      }}
    >
      {children}
    </Context.Provider>
  );
};

I18nProvider.displayName = "I18nProvider";

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { I18nProvider };

export const useI18n = () => useContext(Context);

export const withI18n = Component => {
  return props => {
    const i18nHook = useI18n();

    return <Component {...props} i18n={i18nHook} />;
  };
};
