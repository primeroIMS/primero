import React, { useState } from "react";

const Context = React.createContext();

export function I18nProvider({children}) {
  const [locale, setLocale] = useState(I18n.defaultLocale)

  const changeLocale = (value) => {
    I18n.locale = value
    setLocale(value)
  }

  return (
    <Context.Provider
      value={{
        locale: locale,
        i18n: I18n,
        changeLocale: changeLocale
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
