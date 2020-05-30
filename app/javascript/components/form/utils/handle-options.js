export const generateIdForNewOption = () => `new_option_${Date.now()}`;

export const generateIdFromDisplayText = displayText =>
  `${displayText.toLowerCase().replace(/\s/g, "_")}_${Math.floor(
    Math.random() * 1000000
  )}`;

export const mergeOptions = (options1, options2) =>
  options1.map((option, index) => {
    if (option.isNew && option.display_text) {
      const newOption = options2[index];

      return {
        ...option,
        ...newOption,
        id: generateIdFromDisplayText(newOption.display_text)
      };
    }

    return { ...option, ...options2[index] };
  });
