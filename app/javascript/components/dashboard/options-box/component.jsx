import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardContent, IconButton } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

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

const optionsBox = ({ title, children }) => {
  const css = makeStyles(styles)();
  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <Card className={[css.CardShadow, css.OptionsBox].join(" ")}>
        <CardHeader
          action={
            <IconButton aria-label="Settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={title}
        />
        <CardContent>{children}</CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

optionsBox.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default optionsBox;
