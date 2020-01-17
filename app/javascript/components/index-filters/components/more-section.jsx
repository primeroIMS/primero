import React from "react";
import PropTypes from "prop-types";
import { Link } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { RECORD_PATH } from "../../../config";
import { filterType } from "../utils";

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

  if (recordType !== RECORD_PATH.cases) {
    return null;
  }

  const renderSecondaryFilters = () => {
    // TODO: NEED TO EXCLUDE QUERY_PARAMS
    const secondaryFilters = allAvailable.filter(
      filter =>
        ![
          ...primaryFilters.map(p => p.field_name),
          ...defaultFilters.map(d => d.field_name),
          ...Object.keys(moreSectionFilters)
        ].includes(filter.field_name)
    );

    return secondaryFilters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return (
        <Filter
          filter={filter}
          key={filter.field_name}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
          isSecondary
        />
      );
    });
  };

  const renderText = more ? i18n.t("filters.less") : i18n.t("filters.more");

  const filters = more ? renderSecondaryFilters() : null;

  return (
    <>
      {filters}
      <Link component="button" onClick={() => setMore(!more)}>
        {renderText}
      </Link>
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
