/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from "prop-types";
import { Link } from "@material-ui/core";

import { PRIMERO_IDP } from "../constants";
import { attemptIDPLogin } from "../action-creators";
import { signIn } from "../auth-provider";

const PrimeroIdpLink = ({ identityProviders, i18n, dispatch, css }) => {
  const primeroIdp = identityProviders.find(idp => idp.get("unique_id") === PRIMERO_IDP);
  const tokenCallback = accessToken => {
    dispatch(attemptIDPLogin(accessToken));
  };
  const handleOnClick = () => signIn(primeroIdp, tokenCallback);

  if ((primeroIdp && primeroIdp.size <= 0) || identityProviders.size === 1) {
    return null;
  }

  return (
    <div className={css.linkButtonContainer}>
      <span>{i18n.t("or_label")}</span>
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
