import { memo } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import css from "./styles.css";

function SearchActions({ showSearchButton = true }) {
  return (
    <div className={css.searchActions} data-testid="search-actions">
      {showSearchButton && (
        <ActionButton icon={<SearchIcon />} type={ACTION_BUTTON_TYPES.default} rest={{ type: "submit" }} />
      )}
    </div>
  );
}

SearchActions.displayName = "SearchActions";

SearchActions.propTypes = {
  showSearchButton: PropTypes.bool
};

export default memo(SearchActions);
