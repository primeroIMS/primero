import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { RECORD_TYPES_PLURAL } from "../../../../../../../config";
import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { CREATE_CASE_FROM_FAMILY, RESOURCES, CREATE_RECORDS, usePermissions } from "../../../../../../permissions";

import css from "./styles.css";

function Component({ handleBackLabel, handleBack, handleCreate, handleCreateLabel, pending, recordType }) {
  const canCreateCase = usePermissions(RESOURCES.cases, CREATE_RECORDS);
  const canCreateCaseFromFamily = usePermissions(RESOURCES.families, CREATE_CASE_FROM_FAMILY);
  const canCreateCaseForRecordType = {
    [RECORD_TYPES_PLURAL.case]: canCreateCase,
    [RECORD_TYPES_PLURAL.family]: canCreateCaseFromFamily
  };

  return (
    <div className={css.buttonsRow}>
      <ActionButton
        icon={<ArrowBackIosIcon />}
        text={handleBackLabel}
        type={ACTION_BUTTON_TYPES.default}
        outlined
        rest={{
          onClick: handleBack
        }}
      />
      {canCreateCaseForRecordType[recordType] && (
        <ActionButton
          icon={<AddIcon />}
          text={handleCreateLabel}
          type={ACTION_BUTTON_TYPES.default}
          outlined
          pending={pending}
          rest={{
            onClick: handleCreate
          }}
        />
      )}
    </div>
  );
}

Component.propTypes = {
  handleBack: PropTypes.func,
  handleBackLabel: PropTypes.string,
  handleCreate: PropTypes.func,
  handleCreateLabel: PropTypes.string,
  pending: PropTypes.bool,
  recordType: PropTypes.string
};

Component.displayName = "FamilyMemberActions";

export default Component;
