import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import { RECORD_PATH } from "../../../config";
import { filterType } from "../utils";
import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";

import styles from "./styles.css";
import { NAME } from "./constants";

const MoreSection = ({
  addFilterToList,
  allAvailable,
  defaultFilters,
  filterToList,
  more,
  moreSectionFilters,
  primaryFilters,
  recordType,
  setMore,
  setMoreSectionFilters
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const moreSectionKeys = Object.keys(moreSectionFilters);
  const mode = {
    secondary: true,
    defaultFilter: false
  };

  if (recordType !== RECORD_PATH.cases) {
    return null;
  }

  const renderSecondaryFilters = () => {
    const secondaryFilters = allAvailable.filter(
      field =>
        ![
          ...primaryFilters.map(p => p.field_name),
          ...defaultFilters.map(d => d.field_name),
          ...(!more ? moreSectionKeys : []),
          ...(!more && moreSectionKeys.includes(OR_FILTER_NAME)
            ? [MY_CASES_FILTER_NAME]
            : [])
        ].includes(field.field_name)
    );

    return secondaryFilters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return {};

      return (
        <Filter
          addFilterToList={addFilterToList}
          filter={filter}
          filterToList={filterToList}
          key={filter.field_name}
          mode={mode}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
        />
      );
    });
  };

  const renderText = more ? i18n.t("filters.less") : i18n.t("filters.more");

  const filters = more ? renderSecondaryFilters() : null;

  const handleMore = () => setMore(!more);

  return (
    <>
      {filters}
      <Button
        className={css.moreBtn}
        color="primary"
        size="small"
        variant="outlined"
        fullWidth
        onClick={handleMore}
      >
        {renderText}
      </Button>
    </>
  );
};

MoreSection.displayName = NAME;

MoreSection.propTypes = {
  addFilterToList: PropTypes.func,
  allAvailable: PropTypes.object,
  defaultFilters: PropTypes.object,
  filterToList: PropTypes.object,
  more: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  primaryFilters: PropTypes.object,
  recordType: PropTypes.string,
  setMore: PropTypes.func,
  setMoreSectionFilters: PropTypes.func
};

export default MoreSection;
