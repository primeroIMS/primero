// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "@mui/material";
import { useHistory } from "react-router-dom";

import { PRIMERO_IDP } from "../constants";
import { attemptIDPLogin } from "../action-creators";
import { signIn } from "../auth-provider";
import { useApp } from "../../../../application";
import DisableOffline from "../../../../disable-offline";

function PrimeroIdpLink({ identityProviders, i18n, dispatch, css }) {
  const history = useHistory();
  const { online } = useApp();

  const primeroIdp = identityProviders.find(idp => idp.get("unique_id") === PRIMERO_IDP);
  const onlyPrimeroIDP = primeroIdp && identityProviders?.size === 1;
  const classes = clsx(css.activityContainer, {
    [css.linkButtonContainer]: true,
    [css.onlyLink]: onlyPrimeroIDP
  });
  const tokenCallback = accessToken => {
    dispatch(attemptIDPLogin(accessToken));
  };
  const handleOnClick = () => signIn(primeroIdp, tokenCallback, history);

  if (!primeroIdp) {
    return null;
  }

  const linkText = i18n.t("log_in_primero_idp", { idp_name: primeroIdp.get("name") });

  return (
    <div className={classes}>
      {!onlyPrimeroIDP && <span>{i18n.t("or_label")}</span>}
      {online ? (
        <Link component="a" variant="body2" onClick={handleOnClick}>
          {linkText}
        </Link>
      ) : (
        <DisableOffline offlineTextKey="unavailable_offline">
          <div className={css.linkDisabled}>{linkText}</div>
        </DisableOffline>
      )}
    </div>
  );
}

PrimeroIdpLink.displayName = "PrimeroIdpLink";

PrimeroIdpLink.propTypes = {
  css: PropTypes.object,
  dispatch: PropTypes.func,
  i18n: PropTypes.object,
  identityProviders: PropTypes.object
};

export default PrimeroIdpLink;
