// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useFormFilters } from "../form-filters";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import { NAME, FIRST_PAGE_RESULTS } from "./constants";
import { hasMorePages } from "./utils";
import css from "./styles.css";

function Container({ selectedForm, recordID, recordType, loading, metadata, fetchFn, fetchable = false }) {
  const dispatch = useDispatch();
  const { selectedFilters } = useFormFilters(selectedForm);

  const [page, setPage] = useState(FIRST_PAGE_RESULTS);
  const [more, setMore] = useState(false);

  const hasMore = hasMorePages(metadata);

  const handleMore = () => {
    const nextPage = page + 1;

    setPage(nextPage);
    setMore(!more);
    dispatch(fetchFn(recordType, recordID, nextPage, selectedFilters));
  };

  useEffect(() => {
    if (fetchable && recordID) {
      dispatch(fetchFn(recordType, recordID, page));
    }
  }, [recordID]);

  return (
    <div className={css.moreBtn} data-testid="load-more">
      <ActionButton
        text="filters.more"
        type={ACTION_BUTTON_TYPES.default}
        fullWidth
        variant="outlined"
        onClick={handleMore}
        pending={loading}
        disabled={!hasMore}
      />
    </div>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  fetchable: PropTypes.bool,
  fetchFn: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  metadata: PropTypes.object,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string
};

export default Container;
