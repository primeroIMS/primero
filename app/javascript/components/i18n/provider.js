import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";
import { format, isDate, parseISO } from "date-fns";

import localize from "../../libs/date-picker-localization";
import { DATE_FORMAT } from "../../config";

import { setLocale } from "./action-creators";
import Context from "./context";
import { getLocales, getLocale } from "./selectors";
import useI18n from "./use-i18n";
import withI18n from "./with-i18n";
import { getLocaleDir } from "./utils";

const I18nProvider = ({ children }) => {
  const locale = useSelector(state => getLocale(state));
  const locales = useSelector(state => getLocales(state));

  const dispatch = useDispatch();

  const changeLocale = value => {
    window.I18n.locale = value;
    document.documentElement.lang = value;
    dispatch(setLocale({ locale: value, dir: getLocaleDir(value) }));
  };

  const t = (value, options) => {
    const translation = window.I18n.t(value, options);

    return isEmpty(translation) ? window.I18n.t(value, { locale: window.I18n.defaultLocale, ...options }) : translation;
  };

  const getI18nStringFromObject = i18nObject => {
    if (i18nObject instanceof Object) {
      const localizedValue = i18nObject?.[locale];

      return isEmpty(localizedValue) ? i18nObject?.[window.I18n.defaultLocale] : localizedValue;
    }

    return i18nObject;
  };

  const translateLocales = () =>
    locales.reduce((prev, value) => {
      const result = prev.push(fromJS({ id: value, display_text: window.I18n.t(`home.${value}`) }));

      return result;
    }, fromJS([]));

  const localizeDate = (value, dateFormat = DATE_FORMAT) => {
    const date = isDate(value) ? value : parseISO(value);

    return format(date, dateFormat, { locale: localize(window.I18n) });
  };

  return (
    <Context.Provider
      value={{
        locale,
        applicationLocales: translateLocales(),
        ...window.I18n,
        changeLocale,
        getI18nStringFromObject,
        localizeDate,
        t
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
export { useI18n, withI18n };
