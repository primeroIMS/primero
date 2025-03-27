// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { RECORD_PATH } from "../../../config";
import { getOptionFromAppModule } from "../../application/selectors";
import { useMemoizedSelector } from "../../../libs";
import RecordCreationFlow from "../../record-creation-flow";
import CreateRecordDialog from "../create-record-dialog";
import { SEARCH_AND_CREATE_WORKFLOW } from "../constants";

function Component({ open, onClose, primeroModuleUniqueId, recordType, setOpen }) {
  const searchAndCreateWorkflow = useMemoizedSelector(state =>
    getOptionFromAppModule(state, primeroModuleUniqueId, SEARCH_AND_CREATE_WORKFLOW)
  );

  if (searchAndCreateWorkflow && recordType === RECORD_PATH.cases) {
    return (
      <RecordCreationFlow
        open={Boolean(primeroModuleUniqueId)}
        onClose={onClose}
        recordType={recordType}
        primeroModule={primeroModuleUniqueId}
      />
    );
  }

  return (
    <CreateRecordDialog setOpen={setOpen} open={open} recordType={recordType} moduleUniqueId={primeroModuleUniqueId} />
  );
}

Component.displayName = "SearchCreateWorkflow";

Component.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  primeroModuleUniqueId: PropTypes.string,
  recordType: PropTypes.string,
  setOpen: PropTypes.func
};

export default Component;
