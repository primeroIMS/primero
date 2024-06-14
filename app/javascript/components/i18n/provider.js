// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import every from "lodash/every";
import { format, isDate, parseISO } from "date-fns";
import isString from "lodash/isString";

import localize from "../../libs/date-picker-localization";
import { DATE_FORMAT } from "../../config";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { useChangeTheme } from "../../theme-provider";

import { setLocale } from "./action-creators";
import Context from "./context";
import { getLocales, getLocale, getAppDirection } from "./selectors";
import useI18n from "./use-i18n";
import { getLocaleDir } from "./utils";

const I18nProvider = ({ children }) => {
  const locale = useMemoizedSelector(state => getLocale(state));
  const dir = useMemoizedSelector(state => getAppDirection(state));
  const locales = useMemoizedSelector(state => getLocales(state));
  const changeTheme = useChangeTheme();

  const dispatch = useDispatch();

  const changeLocale = value => {
    const direction = getLocaleDir(value);

    window.I18n.locale = value;
    document.documentElement.lang = value;
    dispatch(setLocale({ locale: value, dir: direction }));
    changeTheme({ direction });
  };

  const getI18nStringFromObject = i18nObject => {
    if (Array.isArray(i18nObject) && every(i18nObject, isString)) {
      return window.I18n.t(i18nObject.join("."));
    }

    if (i18nObject instanceof Object) {
      const localizedValue = i18nObject?.[locale];

      return isEmpty(localizedValue) ? i18nObject?.[window.I18n.defaultLocale] : localizedValue;
    }

    return i18nObject;
  };

  const translateLocales = () =>
    locales?.reduce((prev, value) => [...prev, { id: value, display_text: window.I18n.t(`home.${value}`) }], []);

  const localizeDate = (value, dateFormat = DATE_FORMAT) => {
    const date = isDate(value) ? value : parseISO(value);

    try {
      return format(date, dateFormat, { locale: localize(window.I18n) });
    } catch {
      return null;
    }
  };

  return (
    <Context.Provider
      value={{
        dir,
        locale,
        applicationLocales: translateLocales(),
        ...window.I18n,
        changeLocale,
        getI18nStringFromObject,
        localizeDate
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

export default I18nProvider;

export { useI18n };
