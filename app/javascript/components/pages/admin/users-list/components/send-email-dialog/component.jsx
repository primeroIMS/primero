import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import Form, { FORM_MODE_DIALOG } from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
import { getRecords } from "../../../../../index-table/selectors";
import { getSendEmailsLoading } from "../../selectors";
import { sendEmails } from "../../action-creators";

import { form, validationSchema } from "./form";
import { NAME, FORM_ID } from "./constants";

function Component({ filters, selectedRecords, setSelectedRecords, recordType }) {
  const dispatch = useDispatch();
  const i18n = useI18n();

  const data = useMemoizedSelector(state => getRecords(state, recordType));
  const loading = useMemoizedSelector(state => getSendEmailsLoading(state));

  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()?.length;

  const { dialogOpen, dialogClose } = useDialog(NAME);

  const handleClose = () => {
    dialogClose();
    setSelectedRecords({});
  };

  const handleSubmit = ({ subject, message }) => {
    const userIndex = Object.values(selectedRecords).flat();
    const userIds = userIndex.map(index => data.getIn(["data", index], fromJS({}))?.get("id"));

    dispatch(
      sendEmails({
        filters: selectedRecordsLength <= data.getIn(["data"]).size ? fromJS({ ids: userIds }) : filters,
        subject,
        message,
        snackbarMessage: i18n.t("users.send_email_success", { users_selected: selectedRecordsLength })
      })
    );

    setSelectedRecords({});
  };

  const schema = validationSchema({
    labels: {
      subject: i18n.t("forms.required_field", { field: i18n.t("users.send_email_subject_label") }),
      message: i18n.t("forms.required_field", { field: i18n.t("users.send_email_text_label") })
    }
  });

  return (
    <ActionDialog
      open={dialogOpen}
      dialogTitle={i18n.t("users.send_email_title")}
      dialogSubHeader={i18n.t("users.send_email_selected", { users_selected: selectedRecordsLength })}
      confirmButtonLabel={i18n.t("buttons.send")}
      confirmButtonProps={{ form: FORM_ID, type: "submit" }}
      cancelHandler={handleClose}
      pending={loading}
      omitCloseAfterSuccess
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={form(i18n)}
        onSubmit={handleSubmit}
        initialValues={{ subject: "", message: "" }}
        validations={schema}
        formID={FORM_ID}
        showTitle={false}
      />
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  filters: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.func
};

export default Component;
