import { getIn, connect } from "formik";
import PropTypes from "prop-types";
import { FormHelperText, FormControl, InputLabel } from "@mui/material";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import CaseLinkedRecord from "../../../../case-linked-record";
import { RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { getRegistryOptionsByType } from "../../../../application/selectors";
import { READ_REGISTRY_RECORD, RESOURCES, usePermissions, WRITE_REGISTRY_RECORD } from "../../../../permissions";
import { REGISTRY_DETAILS } from "../../../../case-registry/constants";
import { fetchRelatedRecords, getRelatedRecord } from "../../../../records";
import { useApp } from "../../../../application";
import { useI18n } from "../../../../i18n";

import Search from "./components/search";

function Component({ name, field, recordModuleID, helperText, label, formik, mode, recordType, recordID }) {
  const fieldError = getIn(formik.errors, name);
  const value = getIn(formik.values, name);
  const dispatch = useDispatch();
  const { online } = useApp();
  const i18n = useI18n();

  const { writeRegistryRecord, writeReadRegistryRecord } = usePermissions(RESOURCES.cases, {
    writeRegistryRecord: WRITE_REGISTRY_RECORD,
    writeReadRegistryRecord: [...WRITE_REGISTRY_RECORD, ...READ_REGISTRY_RECORD]
  });

  const relatedRecord = useMemoizedSelector(state =>
    getRelatedRecord(state, { recordType, fromRelationship: false, id: value })
  );

  useEffect(() => {
    if (mode.isShow && value && online) {
      dispatch(
        fetchRelatedRecords({
          recordType,
          relatedRecordType: RECORD_TYPES_PLURAL.registry_record,
          data: { ids: [value] }
        })
      );
    }
  }, [value, online, mode.isShow]);

  const registryOptions = useMemoizedSelector(state => getRegistryOptionsByType(state, field.option_strings_source));
  const linkedRecords = relatedRecord.isEmpty() ? fromJS([]) : fromJS([relatedRecord]);

  return (
    <FormControl id={name} fullWidth error={!!fieldError}>
      <InputLabel shrink htmlFor={name} required={field.required}>
        {label}
      </InputLabel>
      {!value && mode.isShow ? (
        "--"
      ) : (
        <CaseLinkedRecord
          recordID={recordID}
          mode={mode}
          setFieldValue={formik.setFieldValue}
          addNewProps={{
            show: true,
            disabled: false,
            i18nKeys: {
              label: "buttons.add"
            }
          }}
          multiple={false}
          showTitle={false}
          showHeader
          linkField={name}
          previewFieldNames={registryOptions.preview_field_names}
          headerFieldNames={registryOptions.collapsed_field_names}
          linkedRecords={linkedRecords}
          showSelectButton={writeRegistryRecord && !mode.isShow}
          linkedRecordFormUniqueId={REGISTRY_DETAILS}
          disableOffline={{ addNew: true }}
          primeroModule={recordModuleID}
          recordType={recordType}
          linkedRecordType={RECORD_TYPES.registry_records}
          searchFieldNames={registryOptions.searchable_field_names}
          searchTableColumns={registryOptions.collapsed_field_names}
          SearchFormComponent={Search}
          includeIdColumn={false}
          permissions={{ writeRegistryRecord, writeReadRegistryRecord }}
          isPermitted={writeRegistryRecord}
          fieldTitle={label}
          forceDrawerTitle
          emptyPlaceholderText={i18n.t(`${recordType}.registry_empty_placeholder`)}
          drawerTitles={{
            search: i18n.t(`${recordType}.registry_search_for`, { field: label }),
            results: i18n.t(`${recordType}.registry_results`, { field: label })
          }}
        />
      )}

      <FormHelperText>{fieldError || helperText}</FormHelperText>
    </FormControl>
  );
}

Component.displayName = "RegistryField";

Component.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string,
  recordID: PropTypes.string,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string
};

export default connect(Component);
