import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import bindFormSubmit from "../../../../libs/submit-form";

import { NAME } from "./constants";
import { getLookup, getSavingLookup } from "./selectors";
import { clearSelectedLookup, fetchLookup } from "./action-creators";
import { LookupForm } from "./components";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const { prodSite } = useApp();
  const dispatch = useDispatch();
  const formRef = useRef();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const lookup = useSelector(state => getLookup(state));
  const saving = useSelector(state => getSavingLookup(state));

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
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
        rest={{ hide: prodSite }}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction
      actionHandler={handleEdit}
      text={i18n.t("buttons.edit")}
      startIcon={<CreateIcon />}
      rest={{ hide: prodSite }}
    />
  );

  return (
    <LoadingIndicator hasData={formMode.get("isNew") || lookup?.size > 0} loading={!lookup.size} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        {editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <LookupForm mode={mode} formRef={formRef} lookup={lookup} />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
