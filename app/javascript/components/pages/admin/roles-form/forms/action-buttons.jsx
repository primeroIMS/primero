import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { ACTION_BUTTONS_NAME } from "../constants";
import { useI18n } from "../../../../i18n";
import { getSavingRecord } from "../selectors";
import { FormAction } from "../../../../form";
import Permission from "../../../../application/permission";
import { RESOURCES, WRITE_RECORDS } from "../../../../../libs/permissions";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { useMemoizedSelector } from "../../../../../libs";

const Component = ({ formMode, formID, handleCancel, limitedProductionSite }) => {
  const i18n = useI18n();
  const { pathname } = useLocation();

  const saving = useMemoizedSelector(state => getSavingRecord(state));

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        options={{ form: formID, type: "submit", hide: limitedProductionSite }}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <Permission resources={RESOURCES.roles} actions={WRITE_RECORDS}>
      <ActionButton
        icon={<CreateIcon />}
        text={i18n.t("buttons.edit")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          to: `${pathname}/edit`,
          component: Link,
          hide: limitedProductionSite
        }}
      />
    </Permission>
  );

  return (
    <>
      {editButton}
      {saveButton}
    </>
  );
};

Component.displayName = ACTION_BUTTONS_NAME;

Component.propTypes = {
  formID: PropTypes.string.isRequired,
  formMode: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  limitedProductionSite: PropTypes.bool
};

export default Component;
