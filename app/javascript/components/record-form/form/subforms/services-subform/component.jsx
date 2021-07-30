import { useState } from "react";
import PropTypes from "prop-types";
import { getIn, connect } from "formik";

import SubformDialogFields from "../subform-dialog-fields";

import { NAME } from "./constants";

const Component = ({ formik, field, index, mode, formSection, isReadWriteForm, recordModuleID, recordType }) => {
  const [filterState, setFilterState] = useState({
    filtersChanged: false,
    userIsSelected: false
  });

  const filters = (subform, optionStringsSource) => {
    switch (optionStringsSource) {
      case "Agency":
        return {
          service: getIn(formik.values, `service_type`)
        };
      case "User":
        return {
          service: getIn(formik.values, `service_type`),
          location: getIn(formik.values, `service_delivery_location`),
          agency: getIn(formik.values, `service_implementing_agency`)
        };
      default:
        return {};
    }
  };

  const modeDialog =
    isReadWriteForm === false
      ? {
          isShow: true,
          isEdit: false,
          isNew: false
        }
      : mode;

  return (
    <SubformDialogFields
      field={field}
      index={index}
      mode={modeDialog}
      recordModuleID={recordModuleID}
      recordType={recordType}
      filterState={filterState}
      setFilterState={setFilterState}
      filterFunc={(parentField, subformField) => filters(parentField, subformField.option_strings_source)}
      formSection={formSection}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  index: PropTypes.number,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string
};

export default connect(Component);
