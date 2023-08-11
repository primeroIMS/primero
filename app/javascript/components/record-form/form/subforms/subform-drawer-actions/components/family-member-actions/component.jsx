import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";

import css from "./styles.css";

function Component({ handleBack, handleCreate, pending }) {
  return (
    <div className={css.buttonsRow}>
      <ActionButton
        icon={<ArrowBackIosIcon />}
        text="family.family_member.back_to_family_members"
        type={ACTION_BUTTON_TYPES.default}
        outlined
        rest={{
          onClick: handleBack
        }}
      />
      <ActionButton
        icon={<AddIcon />}
        text="family.family_member.create_case"
        type={ACTION_BUTTON_TYPES.default}
        outlined
        pending={pending}
        rest={{
          onClick: handleCreate
        }}
      />
    </div>
  );
}

Component.propTypes = {
  handleBack: PropTypes.func,
  handleCreate: PropTypes.func,
  pending: PropTypes.bool
};

Component.displayName = "FamilyMemberActions";

export default Component;
