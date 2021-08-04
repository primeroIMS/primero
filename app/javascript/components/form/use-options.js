import { isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";

import { useMemoizedSelector } from "../../libs";
import { useI18n } from "../i18n";

import { getOptions } from "./selectors";
import transformOptions from "./utils/transform-options";

const useOptions = (config = {}) => {
  const { source, run = true } = config;
  const { defaultReturn, filterOptions, options, rawOptions, ...selectorConfig } = config;
  const defaultReturnValue = defaultReturn || [];

  const { locale } = useI18n();

  const optionsFromState = useMemoizedSelector(state => {
    if (source && run) {
      const selector = getOptions(source);

      return selector(state, { ...selectorConfig, locale });
    }

    return defaultReturnValue;
  });

  if (source) {
    return filterOptions ? filterOptions(optionsFromState) : optionsFromState;
  }

  if (!isEmpty(options)) {
    if (rawOptions) {
      return options;
    }

    return Array.isArray(options) || isImmutable(options) ? transformOptions(options, locale) : options?.[locale];
  }

  return defaultReturnValue;
};

export default useOptions;
