// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { useI18n } from "../i18n";
import { VIOLATION_GROUP } from "../../config";

import { getOptions } from "./selectors";
import transformOptions from "./utils/transform-options";
import filterTaggedOptions from "./utils/filter-tagged-options";
import { OPTION_TYPES } from "./constants";

const useOptions = (config = {}) => {
  const { source, run = true } = config;
  const { defaultReturn, filterOptions, options, rawOptions, tags, ...selectorConfig } = config;
  const defaultReturnValue = defaultReturn || [];

  const { locale, localizeDate } = useI18n();

  const optionsFromState = useMemoizedSelector(state => {
    if (source && run) {
      if (Array.isArray(source)) {
        return Object.fromEntries(
          source.map(([key, src]) => {
            const selector = getOptions(src);

            // TODO: Refactor. The locations selector uses proxy-memoize. This is a workaround to pass options
            if ([OPTION_TYPES.LOCATION, OPTION_TYPES.REPORTING_LOCATIONS].includes(src)) {
              return [key, selector([state, { ...selectorConfig, source: src, locale, localizeDate }])];
            }

            return [key, selector(state, { ...selectorConfig, source: src, locale, localizeDate })];
          })
        );
      }
      const selector = getOptions(source);

      if ([OPTION_TYPES.LOCATION, OPTION_TYPES.REPORTING_LOCATIONS].includes(source)) {
        return filterTaggedOptions(selector([state, { ...selectorConfig, locale, localizeDate }]), tags);
      }

      return filterTaggedOptions(selector(state, { ...selectorConfig, locale, localizeDate }), tags);
    }

    return defaultReturnValue;
  });

  if (source === VIOLATION_GROUP) {
    return options || [];
  }

  if (source) {
    return filterOptions ? filterOptions(optionsFromState) : optionsFromState;
  }

  if (!isEmpty(options)) {
    if (rawOptions) {
      return options;
    }

    const optionsByLocale =
      Array.isArray(options) || isImmutable(options) ? transformOptions(options, locale) : options?.[locale];

    return filterOptions ? filterOptions(optionsByLocale) : optionsByLocale;
  }

  return defaultReturnValue;
};

export default useOptions;
