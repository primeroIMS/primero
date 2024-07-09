// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { memo, Fragment } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";

import KeyValueCell from "../key-value-cell";
import { useI18n } from "../../../i18n";
import {
  valuesWithDisplayConditions,
  fieldsToRender
} from "../../../record-form/form/subforms/subform-field-array/utils";

import { EXCLUDED_FIELD_TYPES } from "./constants";
import css from "./styles.css";

function Component({ fields, isSubform = false, record }) {
  const i18n = useI18n();

  const classes = {
    subform: css.subform,
    cell: css.cell
  };

  const renderSubform = (field, subformSection, displayName) => {
    const { subform_section_configuration: subformSectionConfiguration } = field;
    const { display_conditions: displayConditions, fields: fieldList } = subformSectionConfiguration || {};
    const values = record.get(field.name, []);

    const filteredValues = displayConditions ? valuesWithDisplayConditions(values, displayConditions) : values;
    const displayFields = fieldsToRender(fieldList, subformSection.fields);

    return filteredValues.map((subform, index) => (
      <Fragment key={record.getIn([subformSection.unique_id, index, "unique_id"])}>
        <h4>{i18n.getI18nStringFromObject(displayName)}</h4>
        <Component fields={displayFields} record={subform} isSubform classes={classes} />
        <div className={css.seperator} />
      </Fragment>
    ));
  };

  return (
    <>
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
          date_include_time: dateIncludeTime,
          defaultValue,
          hide_on_view_page: hideOnShow
        } = field;

        if (subformSection) {
          return (
            <Fragment key={`keyval-${name}-subform`}>{renderSubform(field, subformSection, displayName)}</Fragment>
          );
        }

        if (!visible || EXCLUDED_FIELD_TYPES.includes(type) || hideOnShow) {
          return null;
        }

        return (
          <KeyValueCell
            defaultValue={defaultValue}
            displayName={i18n.getI18nStringFromObject(displayName)}
            value={record.get(name)}
            optionsStringSource={optionStringsSource}
            options={optionsStringsText || options}
            key={`keyval-${name}`}
            type={type}
            isDateWithTime={dateIncludeTime}
            isSubform={isSubform}
            classes={classes}
          />
        );
      })}
    </>
  );
}

Component.displayName = "Table";

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  isSubform: PropTypes.bool,
  record: PropTypes.object.isRequired
};

export default memo(Component, (prev, next) => {
  return (
    isEqual(
      prev.fields.map(field => field.name),
      next.fields.map(field => field.name)
    ) && isEqual(Object.values(prev.record), Object.values(next.record))
  );
});
