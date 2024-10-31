import PropTypes from "prop-types";
import ActionDialog from "../../../../action-dialog";
import Form from "../../../../form";
import form from "./formSections";
import { useI18n } from "../../../../i18n";
import { useDispatch } from "react-redux";
import { fetchMessages, saveMessage } from "../action-creators";

const FORM_ID = "messages-form";

function Component({ open, onClose, submit }) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleSubmit = (message) => {
    dispatch(saveMessage({message}))
    onClose();
  }
  return (
    <ActionDialog dialogTitle={i18n.t("rp_messages.send_message")} open={open} cancelHandler={onClose} confirmButtonLabel={i18n.t("buttons.save")} confirmButtonProps={{form: FORM_ID, type: "submit"}}>
      <Form formID={FORM_ID} formSections={form(i18n)} onSubmit={handleSubmit}/>
    </ActionDialog>
  );
}

// TODO proptypes
Component.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, submit: PropTypes.func };
Component.displayName = "MessageDialog";

export default Component;
