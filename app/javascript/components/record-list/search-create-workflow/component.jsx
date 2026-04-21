// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getOptionFromAppModule } from "../../application/selectors";
import { useMemoizedSelector } from "../../../libs";
import RecordCreationFlow from "../../record-creation-flow";
import { PREVENT_CASE_CREATION_WITHOUT_SEARCH } from "../constants";

function Component({ open, onClose, primeroModuleUniqueId, recordType }) {
  const preventCaseCreationWithoutSearch = useMemoizedSelector(state =>
    getOptionFromAppModule(state, primeroModuleUniqueId, PREVENT_CASE_CREATION_WITHOUT_SEARCH)
  );

  return (
    <RecordCreationFlow
      open={open}
      onClose={onClose}
      recordType={recordType}
      primeroModule={primeroModuleUniqueId}
      preventCaseCreationWithoutSearch={preventCaseCreationWithoutSearch}
    />
  );
}

Component.displayName = "SearchCreateWorkflow";

Component.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  primeroModuleUniqueId: PropTypes.string,
  recordType: PropTypes.string
};

export default Component;
