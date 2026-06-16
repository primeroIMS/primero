import isEmpty from "lodash/isEmpty";

const isStickyOption = (stickyOptionId, optionId) => {
  if (Array.isArray(stickyOptionId)) {
    return stickyOptionId.includes(optionId);
  }

  return stickyOptionId === optionId;
};

export default (options, stickyOptionId, filtersChanged = false) => {
  const enabledOptions = options
    .filter(option => !option.disabled || (stickyOptionId && isStickyOption(stickyOptionId, option.id)))
    .map(option => ({ ...option, disabled: option.disabled }));

  if (stickyOptionId) {
    const stickyOptions = enabledOptions.filter(option => isStickyOption(stickyOptionId, option.id));

    if (isEmpty(stickyOptions) && !filtersChanged) {
      const finalOptionsWithStickyId = options.filter(option => isStickyOption(stickyOptionId, option.id));

      return [
        ...enabledOptions,
        ...finalOptionsWithStickyId.map(stickyOption => ({
          id: stickyOption.id,
          // eslint-disable-next-line camelcase
          display_text: stickyOption?.display_text,
          disabled: true
        }))
      ];
    }
  }

  return enabledOptions;
};
