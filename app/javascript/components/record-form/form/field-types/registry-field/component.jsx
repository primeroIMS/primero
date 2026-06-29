import { getIn, connect } from "formik";
import PropTypes from "prop-types";
import {
  FormHelperText,
  FormControl,
  ListItemSecondaryAction,
  ListItemText,
  InputLabel,
  List,
  ListItem
} from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../action-button";
import SubformEmptyData from "../../subforms/subform-empty-data";
import CaseLinkedRecord from "../../../../case-linked-record";
import { RECORD_TYPES } from "../../../../../config";
import { fetchRecordRelatedRecords } from "../../../../records";
import css from "../../subforms/styles.css";
import { useMemoizedSelector, useThemeHelper } from "../../../../../libs";
import { getRegistryOptionsByType } from "../../../../application/selectors";

import Search from "./components/search";

function Component({ name, field, primeroModule, helperText, label, formik, mode, recordType, recordID }) {
  const fieldError = getIn(formik.errors, name);
  const value = getIn(formik.values, name);

  const { isRTL } = useThemeHelper();
  const registryOptions = useMemoizedSelector(state => getRegistryOptionsByType(state, field.option_strings_source));

  console.log("registryOptions", registryOptions);

  return (
    <FormControl id={name} fullWidth error={!!fieldError}>
      <InputLabel shrink htmlFor={name} required={field.required}>
        {label}
      </InputLabel>
      {!value ? (
        <div>
          <CaseLinkedRecord
            recordID={recordID}
            caseFormUniqueID="child_details"
            mode={mode}
            addNewProps={{
              show: true,
              disabled: false,
              i18nKeys: {
                label: "buttons.add"
              }
            }}
            showTitle={false}
            disableOffline={{ addNew: true }}
            primeroModule={primeroModule}
            recordType={recordType}
            linkedRecordType={RECORD_TYPES.registry_records}
            searchFieldNames={registryOptions.searchable_field_names}
            SearchFormComponent={Search}
            permissions={{ writeRegistryRecord: true, writeReadRegistryRecord: true }}
          />
          <SubformEmptyData subformName={label} single />
        </div>
      ) : (
        <List classes={{ root: css.list }} disablePadding>
          <ListItem component="a">
            <ListItemText className={css.listText}>
              <div className={css.listItemText}>{value}</div>
            </ListItemText>
            <ListItemSecondaryAction classes={{ root: css.listActions }}>
              <ActionButton
                icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  onClick: () => {}
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}
      <FormHelperText>{fieldError || helperText}</FormHelperText>
    </FormControl>
  );
}

Component.displayName = "RegistryField";

Component.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  formSection: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string,
  primeroModule: PropTypes.string.isRequired,
  recordID: PropTypes.string,
  recordType: PropTypes.string
};

export default connect(Component);
