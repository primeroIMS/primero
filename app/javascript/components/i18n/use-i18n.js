import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { format, isDate, parseISO } from "date-fns";

import localize from "../../libs/date-picker-localization";
import { DATE_FORMAT } from "../../config";
import { useMemoizedSelector } from "../../libs";

import { setLocale } from "./action-creators";
import { getLocales, getLocale } from "./selectors";
import { getLocaleDir } from "./utils";

const useI18n = () => {
  const locale = useMemoizedSelector(state => getLocale(state));
  const locales = useMemoizedSelector(state => getLocales(state));

  const dispatch = useDispatch();

  const changeLocale = value => {
    window.I18n.locale = value;
    document.documentElement.lang = value;
    dispatch(setLocale({ locale: value, dir: getLocaleDir(value) }));
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

  return {
    locale,
    applicationLocales: translateLocales(),
    ...window.I18n,
    changeLocale,
    getI18nStringFromObject,
    localizeDate
  };
};

export default useI18n;
