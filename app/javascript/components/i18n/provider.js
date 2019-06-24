import PropTypes from "prop-types";
import React, { useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocale } from "./action-creators";

const Context = createContext();

export function I18nProvider({ children }) {
  const locale = useSelector(state =>
    state.length ? state.getIn(["ui", "I18n", "locale"]) : window.I18n.locale
  );
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

  return (
    <Context.Provider
      value={{
        locale,
        ...window.I18n,
        changeLocale
      }}
    >
      {children}
    </Context.Provider>
  );
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useI18n = () => useContext(Context);
