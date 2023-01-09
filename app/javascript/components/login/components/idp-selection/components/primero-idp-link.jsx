/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "@material-ui/core";

import { PRIMERO_IDP } from "../constants";
import { attemptIDPLogin } from "../action-creators";
import { signIn } from "../auth-provider";

const PrimeroIdpLink = ({ identityProviders, i18n, dispatch, css }) => {
  const primeroIdp = identityProviders.find(idp => idp.get("unique_id") === PRIMERO_IDP);
  const onlyPrimeroIDP = primeroIdp && identityProviders?.size === 1;
  const classes = clsx(css.activityContainer, {
    [css.linkButtonContainer]: true,
    [css.onlyLink]: onlyPrimeroIDP
  });
  const tokenCallback = accessToken => {
    dispatch(attemptIDPLogin(accessToken));
  };
  const handleOnClick = () => signIn(primeroIdp, tokenCallback);

  if (!primeroIdp) {
    return null;
  }

  return (
    <div className={classes}>
      {!onlyPrimeroIDP && <span>{i18n.t("or_label")}</span>}
      <Link component="a" variant="body2" onClick={handleOnClick}>
        {i18n.t("log_in_primero_idp", { idp_name: primeroIdp.get("name") })}
      </Link>
    </div>
  );
};

PrimeroIdpLink.displayName = "PrimeroIdpLink";

PrimeroIdpLink.propTypes = {
  css: PropTypes.object,
  dispatch: PropTypes.func,
  i18n: PropTypes.object,
  identityProviders: PropTypes.object
};

export default PrimeroIdpLink;
