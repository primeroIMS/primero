import { createGenerateClassName, StylesProvider, ThemeProvider, jssPreset } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useMemo } from "react";
import { create } from "jss";
import rtl from "jss-rtl";
import PropTypes from "prop-types";

import { theme } from "../../config";
import CustomSnackbarProvider from "../custom-snackbar-provider";
import { useI18n } from "../i18n";

const generateClassName = createGenerateClassName();

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: document.getElementById("jss-insertion-point")
});

const Component = ({ layout: Layout, children }) => {
  const { locale, dir } = useI18n();

  const appTheme = useMemo(() => theme(dir), [locale, dir]);

  return (
    <ThemeProvider theme={{ ...appTheme, direction: dir }}>
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <CssBaseline />
        <CustomSnackbarProvider>
          <Layout>{children}</Layout>
        </CustomSnackbarProvider>
      </StylesProvider>
    </ThemeProvider>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.func
};

Component.displayName = "Layouts";

export default Component;
