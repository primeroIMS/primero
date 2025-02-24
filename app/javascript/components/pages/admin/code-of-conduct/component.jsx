// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import Form, { FormAction, whichFormMode } from "../../../form";
import { ROUTES } from "../../../../config";
import LoadingIndicator from "../../../loading-indicator";
import Permission, { MANAGE, RESOURCES } from "../../../permissions";
import { useMemoizedSelector } from "../../../../libs";
import { enqueueSnackbar, SNACKBAR_VARIANTS } from "../../../notifier";

import { NAME, FORM_ID } from "./constants";
import { form, validations } from "./form";
import { getCodeOfConduct, getFetchErrorsCodeOfConduct, getLoadingCodeOfConduct } from "./selectors";
import { fetchCodeOfConduct, saveCodeOfConduct } from "./action-creators";

function Component({ mode }) {
  const formMode = whichFormMode(mode);

  const i18n = useI18n();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const fetchErrors = useMemoizedSelector(state => getFetchErrorsCodeOfConduct(state));
  const codeOfConduct = useMemoizedSelector(state => getCodeOfConduct(state));
  const loadingCodeOfConduct = useMemoizedSelector(state => getLoadingCodeOfConduct(state));

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_code_of_conduct));
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleSubmit = data => {
    return dispatch(
      saveCodeOfConduct({
        body: { data },
        message: i18n.t("code_of_conduct.updated")
      })
    );
  };

  const formValidations = validations(i18n);
  const pageHeading = i18n.t("code_of_conduct.info_label");
  const editButton = formMode.get("isShow") ? (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  ) : null;

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
        <FormAction
          text={i18n.t("buttons.save")}
          savingRecord={loadingCodeOfConduct}
          startIcon={<CheckIcon />}
          options={{
            form: FORM_ID,
            type: "submit"
          }}
        />
      </>
    ) : null;

  useEffect(() => {
    dispatch(fetchCodeOfConduct());
  }, []);

  useEffect(() => {
    const messages = fetchErrors.reduce((acc, error) => {
      if (error.get("status") === 404) {
        return acc;
      }

      return acc.concat(error.get("message"));
    }, []);

    if (messages.length) {
      dispatch(enqueueSnackbar(messages.join(", "), { variant: SNACKBAR_VARIANTS.error }));
    }
  }, [fetchErrors]);

  return (
    <Permission resources={RESOURCES.codes_of_conduct} actions={MANAGE} redirect>
      <LoadingIndicator hasData={!codeOfConduct.isEmpty()} type={NAME}>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <Form
            useCancelPrompt
            mode={mode}
            validations={formValidations}
            formSections={form(i18n)}
            onSubmit={handleSubmit}
            initialValues={codeOfConduct.toJS()}
            submitAllFields
            formID={FORM_ID}
          />
        </PageContent>
      </LoadingIndicator>
    </Permission>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
