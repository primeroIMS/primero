import { Menu, MenuItem, Button, makeStyles } from "@material-ui/core";
import LanguageIcon from "@material-ui/icons/Language";
import React, { useState } from "react";
import { DropdownDoubleIcon } from "images/primero-icons";
import { useI18n } from "components/i18n";
import styles from "./styles.css";

const TranslationsToggle = () => {
  const { changeLocale, locale, ...i18n } = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);

  const css = makeStyles(styles)();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = option => {
    setAnchorEl(null);

    if (option) {
      changeLocale(option);
    }
  };

  // TODO: Need better list of locales with direction from backend
  const locales = Object.keys(window.I18n.translations || []);

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

export default TranslationsToggle;
