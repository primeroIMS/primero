import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const OptionsBox = ({ title, action, children }) => {
  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiCardHeader: {
          root: {
            padding: "14px 16px 0 16px"
          }
        },
        MuiCardContent: {
          root: {
            padding: "0",
            "&:last-child": {
              paddingBottom: "0"
            }
          }
        },
        MuiTypography: {
          h5: {
            fontWeight: "bold",
            fontSize: "17px",
            color: "#231E1F",
            textTransform: "uppercase"
          }
        }
      }
    });

  const css = makeStyles(styles)();

  return (
    <MuiThemeProvider theme={{ ...useTheme(), ...getMuiTheme() }}>
      <Card className={[css.CardShadow, css.OptionsBox].join(" ")}>
        <CardHeader action={action} title={title} />
        <CardContent>{children}</CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

OptionsBox.propTypes = {
  title: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node
};

export default OptionsBox;
