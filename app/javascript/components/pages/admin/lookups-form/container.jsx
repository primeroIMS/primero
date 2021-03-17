import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { PageHeading, PageContent } from "../../../page";
import { useI18n } from "../../../i18n";
import { FormAction, whichFormMode } from "../../../form";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { fetchSystemSettings, useApp } from "../../../application";
import { ROUTES } from "../../../../config";
import { useMemoizedSelector } from "../../../../libs";
import Permission from "../../../application/permission";
import { RESOURCES, MANAGE } from "../../../../libs/permissions";

import { NAME } from "./constants";
import { getLookup, getSavingLookup } from "./selectors";
import { clearSelectedLookup, fetchLookup } from "./action-creators";
import { LookupForm } from "./components";
import { FORM_ID } from "./components/form/constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();

  const lookup = useMemoizedSelector(state => getLookup(state));
  const saving = useMemoizedSelector(state => getSavingLookup(state));

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchLookup(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedLookup());
      }
    };
  }, [id]);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, []);

  if (lookup.get("values")?.size <= 0) {
    return null;
  }

  const handleCancel = () => {
    dispatch(push(ROUTES.lookups));
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const pageHeading = lookup?.size
    ? `${i18n.t("lookup.label")} ${lookup.getIn(["name", i18n.locale])}`
    : i18n.t("lookup.create");

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
        options={{
          form: FORM_ID,
          type: "submit",
          hide: limitedProductionSite
        }}
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

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <LoadingIndicator hasData={formMode.get("isNew") || lookup?.size > 0} loading={!lookup.size} type={NAMESPACE}>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <LookupForm mode={mode} lookup={lookup} />
        </PageContent>
      </LoadingIndicator>
    </Permission>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
