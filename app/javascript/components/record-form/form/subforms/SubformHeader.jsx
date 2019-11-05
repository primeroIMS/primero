import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { NAME_FIELD } from "config";
import LookupHeader from "./subform-header-lookup";
import DateHeader from "./subform-header-date";
import { DATE_FIELD, SELECT_FIELD } from "../../constants";
import styles from "./styles.css";

const SubformHeader = ({ field, values, locale, displayName, index }) => {
  const css = makeStyles(styles)();
  const {
    collapsed_field_names: collapsedFieldNames,
    fields
  } = field.subform_section_id;

  const subformValues = collapsedFieldNames
    .map(collapsedField => {
      const val = values[index];
      const {
        type,
        date_include_time: includeTime,
        option_strings_source: optionsStringSource
      } = fields.find(f => f.get(NAME_FIELD) === collapsedField);
      const value = val[collapsedField];

      switch (type) {
        case DATE_FIELD: {
          const dateComponentProps = {
            value: value instanceof Date ? value.toISOString() : value,
            key: collapsedField,
            includeTime
          };
          return <DateHeader {...dateComponentProps} />;
        }
        case SELECT_FIELD: {
          const lookupComponentProps = {
            value,
            key: collapsedField,
            optionsStringSource
          };
          return <LookupHeader {...lookupComponentProps} />;
        }
        default:
          return <span key={collapsedField}>{value}</span>;
      }
    })
    .filter(i => i);

  if (collapsedFieldNames && values) {
    return <Box className={css.subformHeader}>{subformValues}</Box>;
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
