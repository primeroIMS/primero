import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { IconButton, InputBase, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";

import css from "./styles.css";
import { FIELD_NAME_QUERY } from "./constants";

const SearchTextInput = forwardRef(({ error, ...rest }, ref) => {
  const i18n = useI18n();
  const { setValue } = useFormContext();
  const classes = cx({
    [css.searchInputContainer]: true,
    [css.phoneNumberWarning]: !!error
  });

  const handleClear = () => {
    setValue(FIELD_NAME_QUERY, undefined);
  };

  return (
    <div className={classes}>
      <InputBase
        data-testid="search-text-input"
        className={css.searchInput}
        placeholder={i18n.t("navigation.search")}
        inputRef={ref}
        inputProps={{ "aria-label": i18n.t("navigation.search") }}
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
  ref: PropTypes.any,
  rest: PropTypes.object
};

export default SearchTextInput;
