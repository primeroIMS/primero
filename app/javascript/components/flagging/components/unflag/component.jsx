import { useDispatch, batch } from "react-redux";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { List } from "immutable";

import { useI18n } from "../../../i18n";
import { unFlag } from "../../action-creators";
import ActionDialog, { useDialog } from "../../../action-dialog";
import { FLAG_DIALOG } from "../../constants";
import Form, { FieldRecord, FormSectionRecord, FORM_MODE_DIALOG } from "../../../form";

import { NAME, UNFLAG_DIALOG, FORM_ID } from "./constants";

const validationSchema = object().shape({
  unflag_message: string().required()
});

const Component = ({ flag }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { dialogOpen, setDialog, setDialogPending, dialogPending } = useDialog(UNFLAG_DIALOG);

  if (!flag) {
    return null;
  }

  const handleReset = () => {
    setDialog({ dialog: FLAG_DIALOG, open: true, pending: false });
  };

  const handleSubmit = data => {
    batch(() => {
      setDialogPending(true);
      dispatch(unFlag(flag.id, { data }, i18n.t("flags.flag_resolved"), flag.record_type, flag.record_id));
      setDialog({ dialog: FLAG_DIALOG, open: true });
    });
  };

  const formSections = List([
    FormSectionRecord({
      unique_id: "resolve_flag",
      fields: List([
        FieldRecord({
          display_name: i18n.t("flags.resolve_reason"),
          name: "unflag_message",
          type: "text_field",
          required: true,
          autoFocus: true
        })
      ])
    })
  ]);

  return (
    <ActionDialog
      open={dialogOpen}
      maxSize="sm"
      dialogTitle={i18n.t("flags.resolve_flag")}
      confirmButtonLabel={i18n.t("flags.resolve_button")}
      cancelHandler={handleReset}
      pending={dialogPending}
      omitCloseAfterSuccess
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={formSections}
        onSubmit={handleSubmit}
        validations={validationSchema}
        formID={FORM_ID}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object
};

export default Component;
