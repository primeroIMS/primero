import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import isEqual from "lodash/isEqual";

import KeyValueCell from "../key-value-cell";
import { useI18n } from "../../../i18n";
import { DATE_FIELD } from "../../../form";

import styles from "./styles.css";

const Component = ({ fields, record }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const renderSubform = (subformSectionId, displayName) =>
    record.get(subformSectionId.unique_id, []).map((subform, index) => (
      <div key={record.getIn([subformSectionId.unique_id, index, "unique_id"])}>
        <div className={css.subform}>
          <h4>{i18n.getI18nStringFromObject(displayName)}</h4>
          <Component fields={subformSectionId.fields} record={subform} />
        </div>
      </div>
    ));

  return (
    <div className={css.group}>
      {fields.map(field => {
        const {
          name,
          visible,
          subform_section_id: subformSectionId,
          display_name: displayName,
          option_strings_source: optionStringsSource,
          option_strings_text: optionsStringsText,
          options,
          type,
          date_include_time: dateIncludeTime
        } = field;

        if (subformSectionId) {
          return <div key={`keyval-${name}`}>{renderSubform(subformSectionId, displayName)}</div>;
        }

        if (!visible) {
          return null;
        }

        return (
          <KeyValueCell
            displayName={i18n.getI18nStringFromObject(displayName)}
            value={record.get(name)}
            optionsStringSource={optionStringsSource}
            options={optionsStringsText || options}
            key={`keyval-${name}`}
            date={type === DATE_FIELD}
            dateWithTime={dateIncludeTime}
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
