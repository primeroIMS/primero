import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { RESOURCES, WRITE_RECORDS, usePermissions } from "../../../../../../permissions";

import css from "./styles.css";

function Component({ handleBackLabel, handleBack, handleCreate, handleCreateLabel, pending, recordType }) {
  const canWriteRecords = usePermissions(RESOURCES[recordType], WRITE_RECORDS);

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
      {canWriteRecords && (
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
