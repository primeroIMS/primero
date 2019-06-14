import { Menu, MenuItem, Button, makeStyles } from "@material-ui/core";
import LanguageIcon from "@material-ui/icons/Language";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { DropdownDoubleIcon } from "images/primero-icons";
import { withI18n } from "libs";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";
import styles from "./styles.css";

const TranslationsToggle = ({
  changeLocale,
  locale,
  i18n,
  anchorEl,
  setAnchorEl,
  setThemeDirection
}) => {
  const css = makeStyles(styles)();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = option => {
    setAnchorEl(null);

    if (option.locale) {
      changeLocale(option.locale);
      setThemeDirection(option.dir);
    }
  };

  // TODO: Locales should come in this format {locale: locale_abbr, dir: app_direction}
  // to transform into rtl/ltr mode
  const locales = [{ locale: "ar", dir: "rtl" }, { locale: "en", dir: "ltr" }];

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
          <MenuItem key={l.locale} onClick={() => handleClose(l)}>
            {i18n.t(`home.${l.locale}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

TranslationsToggle.propTypes = {
  changeLocale: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  anchorEl: PropTypes.object,
  setAnchorEl: PropTypes.func,
  setThemeDirection: PropTypes.func
};

const mapStateToProps = state => ({
  anchorEl: Selectors.selectAnchorEl(state)
});

const mapDispatchToProps = {
  setAnchorEl: actions.setAnchorEl,
  setThemeDirection: actions.setThemeDirection
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TranslationsToggle)
);
