// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const themePromise =
  process.env.NODE_ENV !== "test"
    ? await (async () => {
        if (window.useTheme) {
          const { default: importedTheme } = await import(
            /* webpackIgnore: true */ `${window.location.origin}/theme?__WB_REVISION__=${window.themeRevision}`
          );

          return importedTheme;
        }

        return {};
      })()
    : {};

export default themePromise;
