import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { RECORD_PATH } from "../../../config";
import { filterType } from "../utils";
import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";

import { NAME } from "./constants";

const MoreSection = ({
  recordType,
  more,
  setMore,
  allAvailable,
  primaryFilters,
  defaultFilters,
  moreSectionFilters,
  setMoreSectionFilters
}) => {
  const i18n = useI18n();
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
          ...moreSectionKeys,
          ...(moreSectionKeys.includes(OR_FILTER_NAME)
            ? [MY_CASES_FILTER_NAME]
            : [])
        ].includes(field.field_name)
    );

    return secondaryFilters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return {};

      return (
        <Filter
          filter={filter}
          key={filter.field_name}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
          mode={mode}
        />
      );
    });
  };

  const renderText = more ? i18n.t("filters.less") : i18n.t("filters.more");

  const filters = more ? renderSecondaryFilters() : null;

  return (
    <>
      {filters}
      <Button color="primary" size="small" onClick={() => setMore(!more)}>
        {renderText}
      </Button>
    </>
  );
};

MoreSection.displayName = NAME;

MoreSection.propTypes = {
  allAvailable: PropTypes.object,
  defaultFilters: PropTypes.object,
  more: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  primaryFilters: PropTypes.object,
  recordType: PropTypes.string,
  setMore: PropTypes.func,
  setMoreSectionFilters: PropTypes.func
};

export default MoreSection;
