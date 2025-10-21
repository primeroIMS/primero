import { fromJS } from "immutable";
import { object, string } from "yup";

import ActionDialog from "../../action-dialog";
import Form, { FieldRecord, FORM_MODE_DIALOG, FormSectionRecord, OPTION_TYPES, SELECT_FIELD } from "../../form";
import { useI18n } from "../../i18n";
import { fetchUsers } from "../../pages/admin/users-list/action-creators";

const FORM_ID = "form_attribute";

function ActionAttribute({ close, open, record, recordType, pending, setPending }) {
  const i18n = useI18n();
  const formSections = fromJS([
    FormSectionRecord({
      unique_id: "form_attribute",
      fields: [
        FieldRecord({
          name: "identified_by",
          required: true,
          display_name: { [i18n.locale]: i18n.t("user.label") },
          type: SELECT_FIELD,
          freeSolo: true,
          asyncOptions: true,
          asyncAction: fetchUsers,
          watchedInputs: ["identified_by"],
          asyncParamsFromWatched: [["identified_by", "identified_by"]],
          option_strings_source: OPTION_TYPES.USER
        })
      ]
    })
  ]);

  const validationSchema = object().shape({ identified_by: string().nullable().required() });

  const handleSubmit = data => {
    setPending(true);
    console.log("data", data);
  };

  console.log("render set-attribute");

  return (
    <ActionDialog
      open={open}
      onClose={close}
      pending={pending}
      omitCloseAfterSuccess
      dialogSubHeader={i18n.t("cases.attribute.text")}
      dialogTitle={i18n.t("cases.attribute.title")}
      confirmButtonLabel={i18n.t("buttons.save")}
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
        showTitle={false}
      />
    </ActionDialog>
  );
}

ActionAttribute.displayName = "ActionAttribute";

export default ActionAttribute;
