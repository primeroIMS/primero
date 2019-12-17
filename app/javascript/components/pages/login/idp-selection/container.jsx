import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { UserAgentApplication } from "msal";
import PropTypes from "prop-types";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";

import { selectIdentityProviders } from "./selectors";
import { signIn, signOut } from "./auth-provider";
import { NAME } from "./config";
import styles from "./styles.css";

let msalApp;

const showIdps = (identityProviders, i18n) => {
  return identityProviders.map(idp => (
    <Button
      className="provider-login"
      color="primary"
      type="submit"
      size="large"
      fullWidth
      key={idp.get("name")}
      onClick={() => signIn(idp)}
    >
      {i18n.t("login.provider_title", {
        provider: idp.get("name")
      })}
    </Button>
  ));
}

const Container = () => {
  const identityProviders = useSelector(state => selectIdentityProviders(state));
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <>
      <PageHeading title={i18n.t("login.title")} whiteHeading />
      <div className={`${css.loginSelection} loginSelection`}>
        {showIdps(identityProviders, i18n)}
      </div>
      <div className={`${css.logoutSelection} logoutSelection`}>
        <Button
          className={`${css.logout} provider-logout`}
          color="primary"
          type="submit"
          size="large"
          fullWidth
          onClick={() => signOut()}
          variant="outlined"
        >
          {i18n.t("navigation.logout")}
        </Button>
      </div>
    </>
  );
};

Container.displayName = NAME;

export default Container;
