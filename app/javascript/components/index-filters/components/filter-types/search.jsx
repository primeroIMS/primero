import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { IconButton, InputBase, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/styles";

import DisableOffline from "../../../disable-offline";
import { useI18n } from "../../../i18n";

import styles from "./styles.css";
import { registerInput } from "./utils";
import handleFilterChange from "./value-handlers";

const Search = ({ handleReset }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { register, unregister, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState();
  const valueRef = useRef();
  const fieldName = "query";
  const fieldNameIdSearch = "id_search";

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      defaultValue: "",
      ref: valueRef,
      setInputValue
    });

    register({ name: fieldNameIdSearch });

    return () => {
      unregister(fieldName);
    };
  }, [register, unregister]);

  const handleChange = event => {
    const { value } = event.target;

    handleFilterChange({
      type: "basic",
      event,
      value: event.target.value,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

    setValue(fieldNameIdSearch, !!value);
  };

  const handleClear = () => {
    setValue(fieldName, undefined);
    setValue(fieldNameIdSearch, undefined);
    handleReset();
  };

  return (
    <div className={css.searchContainer}>
      <div className={css.searchInputContainer}>
        <DisableOffline button>
          <IconButton
            className={css.iconSearchButton}
            aria-label="menu"
            type="submit"
          >
            <SearchIcon />
          </IconButton>
        </DisableOffline>
        <InputBase
          id="search-input"
          className={css.searchInput}
          placeholder={i18n.t("navigation.search")}
          onKeyUp={handleChange}
          onChange={handleChange}
          value={inputValue}
          inputProps={{ "aria-label": i18n.t("navigation.search") }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                className={css.iconSearchButton}
                onClick={handleClear}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
    </div>
  );
};

Search.displayName = "Search";

Search.propTypes = {
  handleReset: PropTypes.func
};

export default Search;
