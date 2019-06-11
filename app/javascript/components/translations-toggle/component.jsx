import { Menu, MenuItem, Button, makeStyles } from "@material-ui/core";
import LanguageIcon from "@material-ui/icons/Language";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { DropdownDoubleIcon } from "images/primero-icons";
import { withI18n } from "libs";
import styles from "./styles.css";

const TranslationsToggle = ({ changeLocale, locale, i18n }) => {
  const css = makeStyles(styles)();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = value => {
    setAnchorEl(null);

    if (value) {
      changeLocale(value);
    }
  };

  const locales = ["ar", "en"];

  return (
    <>
      <Button
        className={css.button}
        onClick={handleClick}
        aria-haspopup="true"
        aria-owns={anchorEl ? "simple-menu" : undefined}
      >
        <LanguageIcon />
        <div>{i18n.t(`home.${locale}`)}</div>
        <DropdownDoubleIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        {locales.map(l => (
          <MenuItem key={l} onClick={() => handleClose(l)}>
            {i18n.t(`home.${l}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

TranslationsToggle.propTypes = {
  changeLocale: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withI18n
)(TranslationsToggle);
