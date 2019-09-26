import React from "react";
import PropTypes from "prop-types";
import { Box, makeStyles } from "@material-ui/core";
import styles from "./styles.css";

const SubformHeader = ({ field, values, locale, displayName, index }) => {
  const {
    collapsed_field_names: collapsedFieldNames
  } = field.subform_section_id;

  const css = makeStyles(styles)();

  if (collapsedFieldNames) {
    const [primaryField, secondaryField] = collapsedFieldNames;
    const val = values?.[index];
    const secondaryValue = val[secondaryField];
    const primaryValue = val[primaryField];

    if (secondaryValue && primaryValue) {
      return (
        <Box>
          <div className={css.secondarySubformHeader}>{secondaryValue}</div>
          <div>{primaryValue}</div>
        </Box>
      );
    }
  }

  return <>{displayName?.[locale]}</>;
};

SubformHeader.propTypes = {
  field: PropTypes.object.isRequired,
  values: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  displayName: PropTypes.object,
  index: PropTypes.number.isRequired
};

export default SubformHeader;
