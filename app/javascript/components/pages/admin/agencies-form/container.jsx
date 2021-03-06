import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../agencies-list/namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { useApp } from "../../../application";

import { localizeData, translateFields } from "./utils";
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
  const agency = useSelector(state => getAgency(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const validationSchema = validations(formMode, i18n);

  const canEditAgencies = usePermissions(NAMESPACE, WRITE_RECORDS);

  const saving = useSelector(state => getSavingRecord(state));

  const handleSubmit = data => {
    const localizedData = localizeData(data, ["name", "description"], i18n);

    if (formMode.get("isNew")) {
      localizedData.name = {
        en: "No translation provided",
        ...localizedData.name
      };
    }

    dispatch(
      saveAgency({
        id,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body: { data: localizedData },
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
      logo_icon_url: agency.get("logo_icon")
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
          initialValues={translateFields(selectedAgency, ["name", "description"], i18n)}
          formErrors={formErrors}
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
