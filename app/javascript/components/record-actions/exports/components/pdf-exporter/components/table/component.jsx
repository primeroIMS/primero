import React from "react";
import PropTypes from "prop-types";

import KeyValueCell from "../key-value-cell";
import { useI18n } from "../../../../../../i18n";

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
            options
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
