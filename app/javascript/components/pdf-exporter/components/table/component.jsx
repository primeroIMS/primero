import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import isEqual from "lodash/isEqual";

import KeyValueCell from "../key-value-cell";
import { useI18n } from "../../../i18n";
import { DATE_FIELD, TICK_FIELD } from "../../../form";
import { valuesWithDisplayConditions } from "../../../record-form/form/subforms/subform-field-array/utils";

import { EXCLUDED_FIELD_TYPES } from "./constants";
import styles from "./styles.css";

const Component = ({ fields, record }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const renderSubform = (field, subformSection, displayName) => {
    const { subform_section_configuration: subformSectionConfiguration } = field;
    const { display_conditions: displayConditions } = subformSectionConfiguration || {};
    const values = record.get(subformSection.unique_id, []);
    const filteredValues = displayConditions ? valuesWithDisplayConditions(values, displayConditions) : values;

    return filteredValues.map((subform, index) => (
      <div key={record.getIn([subformSection.unique_id, index, "unique_id"])}>
        <div className={css.subform}>
          <h4>{i18n.getI18nStringFromObject(displayName)}</h4>
          <Component fields={subformSection.fields} record={subform} />
        </div>
      </div>
    ));
  };

  return (
    <div className={css.group}>
      {fields.map(field => {
        const {
          name,
          visible,
          subform_section_id: subformSection,
          display_name: displayName,
          option_strings_source: optionStringsSource,
          option_strings_text: optionsStringsText,
          options,
          type,
          date_include_time: dateIncludeTime
        } = field;

        if (subformSection) {
          return <div key={`keyval-${name}`}>{renderSubform(field, subformSection, displayName)}</div>;
        }

        if (!visible || EXCLUDED_FIELD_TYPES.includes(type)) {
          return null;
        }

        return (
          <KeyValueCell
            displayName={i18n.getI18nStringFromObject(displayName)}
            value={record.get(name)}
            optionsStringSource={optionStringsSource}
            options={optionsStringsText || options}
            key={`keyval-${name}`}
            isDateField={type === DATE_FIELD}
            isDateWithTime={dateIncludeTime}
            isBooleanField={type === TICK_FIELD}
          />
        );
      })}
    </div>
  );
};

Component.displayName = "Table";

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired
};

export default React.memo(Component, (prev, next) => {
  return isEqual(
    prev.fields.map(field => field.name),
    next.fields.map(field => field.name)
  );
});
