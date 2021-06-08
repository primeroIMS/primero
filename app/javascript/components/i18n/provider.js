import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { format, isDate, parseISO } from "date-fns";

import localize from "../../libs/date-picker-localization";
import { DATE_FORMAT } from "../../config";
import { useMemoizedSelector } from "../../libs";

import { setLocale } from "./action-creators";
import Context from "./context";
import { getLocales, getLocale, getAppDirection } from "./selectors";
import useI18n from "./use-i18n";
import { getLocaleDir } from "./utils";

const I18nProvider = ({ children }) => {
  const locale = useMemoizedSelector(state => getLocale(state));
  const dir = useMemoizedSelector(state => getAppDirection(state));
  const locales = useMemoizedSelector(state => getLocales(state));

  const dispatch = useDispatch();

  const changeLocale = value => {
    const whichDir = getLocaleDir(value);

    window.I18n.locale = value;
    document.documentElement.lang = value;
    document.documentElement.dir = whichDir;
    dispatch(setLocale({ locale: value, dir: whichDir }));
  };

  const getI18nStringFromObject = i18nObject => {
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
