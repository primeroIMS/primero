import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useDialog } from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../agencies-list/namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";
import { NAME as TranslationsFormName } from "../../../translations-dialog/constants";
import TranslationsDialog from "../../../translations-dialog";
import { buildLocaleFields, localesToRender } from "../../../translations-dialog/utils";

import { NAME, FORM_ID } from "./constants";
import { form, validations } from "./form";
import { fetchAgency, clearSelectedAgency, saveAgency } from "./action-creators";
import { getAgency, getServerErrors, getSavingRecord } from "./selectors";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { limitedProductionSite } = useApp();
  const { dialogOpen, setDialog } = useDialog(TranslationsFormName);

  const agency = useMemoizedSelector(state => getAgency(state));
  const formErrors = useMemoizedSelector(state => getServerErrors(state));
  const saving = useMemoizedSelector(state => getSavingRecord(state));

  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const validationSchema = validations(i18n);

  const canEditAgencies = usePermissions(NAMESPACE, WRITE_RECORDS);

  const registeredFields = buildLocaleFields(localesToRender(i18n.applicationLocales));

  const handleSubmit = data => {
    dispatch(
      saveAgency({
        id,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body: {
          data: formMode.get("isNew") ? { ...data, name: { en: "No translation provided", ...data.name } } : data
        },
        message: i18n.t(`agency.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_agencies));
  };

  const onManageTranslations = () => setDialog({ dialog: TranslationsFormName, open: true });

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchAgency(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedAgency());
      }
    };
  }, [id]);

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction actionHandler={onManageTranslations} text={i18n.t("agencies.translations.manage")} />
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        options={{ form: FORM_ID, type: "submit", hide: limitedProductionSite }}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction
      actionHandler={handleEdit}
      text={i18n.t("buttons.edit")}
      startIcon={<CreateIcon />}
      options={{ hide: limitedProductionSite }}
    />
  );

  const pageHeading = agency?.size
    ? `${i18n.t("agencies.label")} ${agency.getIn(["name", i18n.locale])}`
    : i18n.t("agencies.label");

  const selectedAgency = {
    ...agency.toJS(),
    ...{
      logo_full_url: agency.get("logo_full"),
      logo_icon_url: agency.get("logo_icon"),
      terms_of_use_url: agency.get("terms_of_use")
    }
  };

  return (
    <LoadingIndicator hasData={formMode.get("isNew") || agency?.size > 0} loading={!agency.size} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        {canEditAgencies && editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Form
          formID={FORM_ID}
          useCancelPrompt
          mode={mode}
          formSections={form(i18n, formMode)}
          onSubmit={handleSubmit}
          validations={validationSchema}
          registerFields={registeredFields}
          initialValues={selectedAgency}
          formErrors={formErrors}
          renderBottom={formMethods =>
            dialogOpen && (
              <TranslationsDialog
                dialogTitle={i18n.t("reports.translations.edit")}
                formMethods={formMethods}
                mode={mode}
              />
            )
          }
        />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
