import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import Form, { FormAction, whichFormMode } from "../../../form";
import { ROUTES } from "../../../../config";
import LoadingIndicator from "../../../loading-indicator";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";
import { useMemoizedSelector } from "../../../../libs";

import { NAME, FORM_ID } from "./constants";
import { form } from "./form";
import { selectContactInformation, selectSavingContactInformation } from "./selectors";
import { saveContactInformation } from "./action-creators";

const Component = ({ mode }) => {
  const formMode = whichFormMode(mode);

  const i18n = useI18n();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const contactInformation = useMemoizedSelector(state => selectContactInformation(state));
  const savingRecord = useMemoizedSelector(state => selectSavingContactInformation(state));

  const handleCancel = () => {
    dispatch(push(ROUTES.contact_information));
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleSubmit = data => {
    return dispatch(
      saveContactInformation({
        saveMethod: formMode.get("isEdit") ? "update" : "new",
        body: { data },
        message: i18n.t("contact.updated")
      })
    );
  };

  const pageHeading = i18n.t("contact.info_label");
  const editButton = formMode.get("isShow") ? (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  ) : null;

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
        <FormAction
          text={i18n.t("buttons.save")}
          savingRecord={savingRecord}
          startIcon={<CheckIcon />}
          options={{
            form: FORM_ID,
            type: "submit"
          }}
        />
      </>
    ) : null;

  return (
    <Permission resources={RESOURCES.systems} actions={MANAGE} redirect>
      <LoadingIndicator hasData={contactInformation?.size > 0} type={NAME}>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <Form
            useCancelPrompt
            mode={mode}
            formSections={form(i18n)}
            onSubmit={handleSubmit}
            initialValues={contactInformation.toJS()}
            formID={FORM_ID}
          />
        </PageContent>
      </LoadingIndicator>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
