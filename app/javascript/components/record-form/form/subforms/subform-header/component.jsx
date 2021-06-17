import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { NAME_FIELD, DATE_FIELD, SELECT_FIELD, TICK_FIELD, RADIO_FIELD } from "../../../constants";
import SubformLookupHeader from "../subform-header-lookup";
import SubformDateHeader from "../subform-header-date";
import SubformTickBoxHeader from "../subform-header-tickbox";
import styles from "../styles.css";
import { SUBFORM_HEADER } from "../constants";

const useStyles = makeStyles(styles);

const Component = ({ field, values, locale, displayName, index, onClick }) => {
  const css = useStyles();
  const { collapsed_field_names: collapsedFieldNames, fields } = field.subform_section_id;

  const subformValues = collapsedFieldNames
    .map(collapsedFieldName => {
      const val = values[index];
      const {
        type,
        date_include_time: includeTime,
        option_strings_source: optionsStringSource,
        option_strings_text: optionsStringText,
        tick_box_label: tickBoxLabel
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
        case TICK_FIELD: {
          const componentProps = {
            value,
            tickBoxLabel
          };

          return <SubformTickBoxHeader {...componentProps} />;
        }
        case RADIO_FIELD:
        case SELECT_FIELD: {
          const lookupComponentProps = {
            value: typeof value === "boolean" ? value.toString() : value,
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

  const handleClick = () => onClick(index);

  if (collapsedFieldNames.length && values.length) {
    return (
      <div className={css.subformHeader}>
        <Button onClick={handleClick}>{subformValues}</Button>
      </div>
    );
  }

  return <Button onClick={handleClick}>{displayName?.[locale]}</Button>;
};

Component.displayName = SUBFORM_HEADER;

Component.propTypes = {
  displayName: PropTypes.object,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
