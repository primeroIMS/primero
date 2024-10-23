import PropTypes from "prop-types";
import ActionDialog from "../../../../action-dialog";
import Form from "../../../../form";
import form from "./formSections";
import { useI18n } from "../../../../i18n";

function Component({open, onClose}) {
    const i18n = useI18n();
    return <ActionDialog dialogTitle={i18n.t("messages.send_message")} open={open} cancelHandler={onClose}>
        <Form
            formID="messages-form"
            formSections={form(i18n)}
        />
    </ActionDialog>
}

// TODO proptypes
Component.propTypes = {open: PropTypes.bool, onClose: PropTypes.func};
Component.displayName = "MessageDialog";

export default Component;