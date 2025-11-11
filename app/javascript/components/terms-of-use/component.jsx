// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Typography, useMediaQuery } from "@mui/material";

import { ROUTES } from "../../config";
import { useI18n } from "../i18n";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import { getUser, getUserAgencyTermsOfUseChanged, getUserAgencyTermsOfUseEnabled } from "../user";
import LoadingIndicator from "../loading-indicator";
import { getTermsOfUseAcknowledge, getAgency } from "../application/selectors";
import ModuleLogo from "../module-logo";
import TranslationsToggle from "../translations-toggle";

import { NAME, ID } from "./constants";
import css from "./styles.css";
import { acceptTermsOfUse } from "./action-creators";
import { selectUpdatingTermsOfUse } from "./selectors";
import { Actions, CancelDialog, Preview } from "./components";

function Component() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const [previewOpen, setPreviewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [hasViewedTerms, setHasViewedTerms] = useState(false);

  const currentUser = useMemoizedSelector(state => getUser(state));
  const updatingTermsOfUse = useMemoizedSelector(state => selectUpdatingTermsOfUse(state));
  const agencyTermsOfUseEnabled = useMemoizedSelector(state => getUserAgencyTermsOfUseEnabled(state));
  const agencyTermsOfUseAcceptedChanged = useMemoizedSelector(state => getUserAgencyTermsOfUseChanged(state));
  const termsOfUseAcknowledge = useMemoizedSelector(state => getTermsOfUseAcknowledge(state));
  const agency = useMemoizedSelector(state => getAgency(state, currentUser.get("agencyId")));
  const termsOfUseUrl = agency?.get("terms_of_use");

  const termsOfUseAgencySignText =
    displayNameHelper(termsOfUseAcknowledge, i18n.locale) || i18n.t("terms_of_use.content");

  if (!agency && !agencyTermsOfUseEnabled) {
    return null;
  }

  const formattedDate = agency?.get("terms_of_use_uploaded_at")
    ? format(parseISO(agency?.get("terms_of_use_uploaded_at")), "MMMM d, yyyy")
    : "";

  const handleAcceptTermsOfUse = () => {
    dispatch(
      acceptTermsOfUse({
        userId: currentUser.get(ID),
        path: location?.state?.referrer || ROUTES.dashboard
      })
    );
  };

  const handleViewTerms = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setHasViewedTerms(true);
  };

  const handleCancel = () => {
    setCancelOpen(true);
  };

  return (
    <LoadingIndicator loading={!agencyTermsOfUseEnabled} hasData={agencyTermsOfUseEnabled} type={NAME}>
      <div className={css.container} data-testid="terms-of-use-container">
        <ModuleLogo white />
        <div className={css.content}>
          <div id="printPdf" className={css.details}>
            <h2>{i18n.t("terms_of_use.title")}</h2>
            <h3>{`${i18n.t("updated")} ${formattedDate}`}</h3>
            <h3>{agencyTermsOfUseAcceptedChanged ? i18n.t("terms_of_use.changed_message") : ""}</h3>
            <Typography className={css.text}>{termsOfUseAgencySignText}</Typography>
          </div>
          <Actions
            css={css}
            handleAccept={handleAcceptTermsOfUse}
            handleCancel={handleCancel}
            handleViewTerms={handleViewTerms}
            hasViewedTerms={hasViewedTerms}
            updatingTermsOfUse={updatingTermsOfUse}
          />
        </div>
        <div className={css.translationToogle}>
          <TranslationsToggle />
        </div>
        <CancelDialog open={cancelOpen} setOpen={setCancelOpen} i18n={i18n} dispatch={dispatch} />
      </div>

      <Preview
        open={previewOpen}
        onClose={handlePreviewClose}
        termsOfUseUrl={termsOfUseUrl}
        mobileDisplay={mobileDisplay}
      />
    </LoadingIndicator>
  );
}

Component.displayName = NAME;

export default Component;
