import React from "react";
import PropTypes from "prop-types";
import { Link } from "@material-ui/core";

import { RECORD_PATH } from "../../../config";
import { filterType } from "../utils";

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
  if (recordType !== RECORD_PATH.cases) {
    return null;
  }

  const renderSecondaryFilters = () => {
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
        />
      );
    });
  };

  const renderMore = more ? (
    <>
      <Link component="button" onClick={() => setMore(false)}>
        Less...
      </Link>
      <br />
      <br />
      {renderSecondaryFilters()}
    </>
  ) : (
    <Link component="button" onClick={() => setMore(true)}>
      More...
    </Link>
  );

  return (
    <>
      <br />
      {renderMore}
    </>
  );
};

MoreSection.displayName = "MoreSection";

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
