// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Typography, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useI18n } from "../../../../i18n";
import { getUser } from "../../../../user";
import { getAgency } from "../../../../application/selectors";
import { useMemoizedSelector, displayNameHelper } from "../../../../../libs";
import { CODE_OF_CONDUCT_DATE_FORMAT } from "../../../../../config";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import ActionButton from "../../../../action-button";
import Preview from "../../../../terms-of-use/components/preview";
import parentCss from "../../styles.css";

import { NAME } from "./constants";
import css from "./styles.css";

function Component() {
  const i18n = useI18n();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const [previewOpen, setPreviewOpen] = useState(false);

  const currentUser = useMemoizedSelector(state => getUser(state));
  const agency = useMemoizedSelector(state => getAgency(state, currentUser.get("agencyId")));
  const termsOfUseUrl = agency?.get("terms_of_use");
  const termsOfUseUploadedAtFormatted = agency?.get("terms_of_use_uploaded_at")
    ? format(parseISO(agency?.get("terms_of_use_uploaded_at")), CODE_OF_CONDUCT_DATE_FORMAT)
    : "";

  const handleViewTerms = () => setPreviewOpen(!previewOpen);

  if (!termsOfUseUrl) {
    return null;
  }

  return (
    <div className={parentCss.termsOfUse}>
      <h2>{i18n.t("navigation.support_menu.terms_of_use")}</h2>
      <h3>{`${i18n.t("agency.label")} ${displayNameHelper(agency.get("name"), i18n.locale)}`}</h3>
      <h3>{`${i18n.t("terms_of_use.date_upload_updated")} ${termsOfUseUploadedAtFormatted}`}</h3>
      <Typography className={css.text}>{i18n.t("terms_of_use.terms_of_use_accepted")}</Typography>
      <ActionButton
        id="terms-of-use-view"
        icon={<VisibilityIcon />}
        text="terms_of_use.view_button"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleViewTerms
        }}
      />
      <Preview
        open={previewOpen}
        onClose={handleViewTerms}
        termsOfUseUrl={termsOfUseUrl}
        mobileDisplay={mobileDisplay}
      />
    </div>
  );
}

Component.displayName = NAME;

export default Component;
