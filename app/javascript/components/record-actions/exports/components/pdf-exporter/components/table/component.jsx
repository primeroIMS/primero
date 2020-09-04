import React from "react";
import PropTypes from "prop-types";

import KeyValueCell from "../key-value-cell";
import { useI18n } from "../../../../../../i18n";
import { DATE_FIELD } from "../../../../../../form";

const Component = ({ fields, record }) => {
  const i18n = useI18n();

  return (
    <table>
      <tbody>
        {fields.map(field => {
          const {
            name,
            subform_section_id: subformSectionId,
            display_name: displayName,
            option_strings_source: optionStringsSource,
            option_strings_text: optionsStringsText,
            options,
            type,
            date_include_time: dateIncludeTime
          } = field;

          if (subformSectionId) {
            return record.get(subformSectionId.unique_id, []).map((subform, index) => (
              <tr key={record.getIn([subformSectionId.unique_id, index, "unique_id"])}>
                <td colSpan={2}>
                  <h4>{i18n.getI18nStringFromObject(displayName)}</h4>
                  <Component fields={subformSectionId.fields} record={subform} />
                </td>
              </tr>
            ));
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
      </tbody>
    </table>
  );
};

Component.displayName = "Table";

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired
};

export default Component;
