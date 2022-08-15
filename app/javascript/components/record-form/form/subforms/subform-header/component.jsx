import PropTypes from "prop-types";
import { ListItemText } from "@material-ui/core";
import clsx from "clsx";

import { NAME_FIELD, DATE_FIELD, SELECT_FIELD, TICK_FIELD, RADIO_FIELD, TALLY_FIELD } from "../../../constants";
import SubformLookupHeader from "../subform-header-lookup";
import SubformDateHeader from "../subform-header-date";
import SubformTickBoxHeader from "../subform-header-tickbox";
import SubformHeaderTally from "../subform-header-tally";
import ViolationItem from "../subform-fields/components/violation-item";
import css from "../styles.css";
import { SUBFORM_HEADER } from "../constants";
import { VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS, LOCALE_KEYS } from "../../../../../config";
import { getShortIdFromUniqueId } from "../../../../records/utils";
import { useI18n } from "../../../../i18n";

import { ListItemTextSecondary } from "./components";

const Component = ({ field, values, locale, displayName, index, isViolationSubform, associatedViolations }) => {
  const i18n = useI18n();
  const { collapsed_field_names: collapsedFieldNames, fields } = field.subform_section_id;
  const itemClasses = { primary: css.listText };
  const listItemTextClasses = clsx({
    [css.listItemText]: true,
    [css.listItemNepaliItem]: i18n.locale === LOCALE_KEYS.ne
  });
  const renderShortId =
    // eslint-disable-next-line camelcase
    VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS.includes(field.name) && getShortIdFromUniqueId(values[index]?.unique_id);
  const subformValues = collapsedFieldNames
    .map(collapsedFieldName => {
      const val = values[index];
      const {
        type,
        date_include_time: includeTime,
        option_strings_source: optionsStringSource,
        option_strings_text: optionsStringText,
        tick_box_label: tickBoxLabel,
        display_name: displayNameCollapsedField
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
            optionsStringText,
            isViolationSubform,
            displayName: displayNameCollapsedField
          };

          return <SubformLookupHeader {...lookupComponentProps} />;
        }
        case TALLY_FIELD: {
          return <SubformHeaderTally value={value} displayName={displayNameCollapsedField} locale={locale} />;
        }
        default:
          return value && <span key={collapsedFieldName}>{value}</span>;
      }
    })
    .filter(i => i);

  if (collapsedFieldNames.length && values.length) {
    if (isViolationSubform) {
      return (
        <ViolationItem
          fields={fields}
          displayName={displayName}
          locale={locale}
          values={values}
          index={index}
          collapsedFieldValues={subformValues}
        />
      );
    }

    return (
      <ListItemText
        id="subform-header-button"
        classes={itemClasses}
        secondary={
          <ListItemTextSecondary
            associatedViolations={associatedViolations}
            violationsIDs={values[index]?.violations_ids}
          />
        }
      >
        <div className={listItemTextClasses}>
          {renderShortId && <span>{renderShortId}</span>}
          {subformValues}
        </div>
      </ListItemText>
    );
  }

  return <ListItemText classes={itemClasses}>{displayName?.[locale]}</ListItemText>;
};

Component.displayName = SUBFORM_HEADER;

Component.propTypes = {
  associatedViolations: PropTypes.object,
  displayName: PropTypes.object,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isViolationSubform: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
