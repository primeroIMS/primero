import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { NAME_FIELD, DATE_FIELD, SELECT_FIELD } from "../../../constants";
import SubformLookupHeader from "../subform-header-lookup";
import SubformDateHeader from "../subform-header-date";
import styles from "../styles.css";
import { SUBFORM_HEADER } from "../constants";

const Component = ({ field, values, locale, displayName, index }) => {
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
        option_strings_source: optionsStringSource,
        option_strings_text: optionsStringText
      } = fields.find(f => f.get(NAME_FIELD) === collapsedFieldName);
      const value = val[collapsedFieldName];

      switch (type) {
        case DATE_FIELD: {
          const dateComponentProps = {
            value: value instanceof Date ? value.toISOString() : value,
            key: collapsedFieldName,
            includeTime
          };

          return <SubformDateHeader {...dateComponentProps} />;
        }
        case SELECT_FIELD: {
          const lookupComponentProps = {
            value,
            key: collapsedFieldName,
            optionsStringSource,
            optionsStringText
          };

          return <SubformLookupHeader {...lookupComponentProps} />;
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

Component.displayName = SUBFORM_HEADER;

Component.propTypes = {
  displayName: PropTypes.object,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
