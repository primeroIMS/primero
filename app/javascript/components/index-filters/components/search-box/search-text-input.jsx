import { forwardRef } from "react";
import PropTypes from "prop-types";
import { IconButton, InputBase, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";

import css from "./styles.css";
import { FIELD_NAME_QUERY } from "./constants";

const SearchTextInput = forwardRef(({ error, formMethods, showInputBorder = true, ...rest }, ref) => {
  const i18n = useI18n();
  const { setValue } = formMethods;
  const classes = cx({
    [css.searchInputContainer]: showInputBorder,
    [css.searchContainerFullWidth]: true,
    [css.phoneNumberWarning]: !!error
  });
  const placeholder = rest.placeholder || i18n.t("navigation.search");

  const handleClear = () => {
    setValue(FIELD_NAME_QUERY, undefined);
  };

  return (
    <div className={classes}>
      <InputBase
        data-testid="search-text-input"
        className={css.searchInput}
        placeholder={placeholder}
        inputRef={ref}
        inputProps={{ "aria-label": placeholder }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton className={css.iconSearchButton} onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        }
        {...rest}
      />
    </div>
  );
});

SearchTextInput.displayName = "SearchInput";

SearchTextInput.propTypes = {
  error: PropTypes.bool,
  formMethods: PropTypes.object,
  ref: PropTypes.any,
  rest: PropTypes.object,
  showInputBorder: PropTypes.bool
};

export default SearchTextInput;
