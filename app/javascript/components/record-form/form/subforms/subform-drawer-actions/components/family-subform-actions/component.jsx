// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { CREATE_CASE_FROM_FAMILY, usePermissions } from "../../../../../../permissions";

import css from "./styles.css";

function Component({ handleBackLabel, handleBack, handleCreate, handleCreateLabel, pending, recordType }) {
  const canCreateCaseFromFamily = usePermissions(recordType, CREATE_CASE_FROM_FAMILY);

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
      {canCreateCaseFromFamily && (
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
