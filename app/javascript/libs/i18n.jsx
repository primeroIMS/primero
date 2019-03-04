import PropTypes from "prop-types";
import React, { useState } from "react";

const Context = React.createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(window.I18n.defaultLocale);

  const changeLocale = value => {
    window.I18n.locale = value;
    setLocale(value);
  };

  return (
    <Context.Provider
      value={{
        locale,
        i18n: window.I18n,
        changeLocale
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function withI18n(Component) {
  return function I18nComponent(props) {
    return (
      <Context.Consumer>
        {context => {
          return <Component {...props} {...context} />;
        }}
      </Context.Consumer>
    );
  };
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired
};
