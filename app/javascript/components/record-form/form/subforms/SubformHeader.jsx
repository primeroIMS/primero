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
    .map(collapsedFieldName => {
      const val = values[index];
      const {
        type,
        date_include_time: includeTime,
        option_strings_source: optionsStringSource
      } = fields.find(f => f.get(NAME_FIELD) === collapsedFieldName);
      const value = val[collapsedFieldName];

      switch (type) {
        case DATE_FIELD: {
          const dateComponentProps = {
            value: value instanceof Date ? value.toISOString() : value,
            key: collapsedFieldName,
            includeTime
          };
          return <DateHeader {...dateComponentProps} />;
        }
        case SELECT_FIELD: {
          const lookupComponentProps = {
            value,
            key: collapsedFieldName,
            optionsStringSource
          };
          return <LookupHeader {...lookupComponentProps} />;
        }
        default:
          return <span key={collapsedFieldName}>{value}</span>;
      }
    })
    .filter(i => i);

  if (collapsedFieldNames.length && values.length) {
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
