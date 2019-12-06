import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as Msal from "msal";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";
import styles from "../login-form/styles.css";

import { selectIdentityProviders } from "./selectors";
import { signIn, signOut } from "./auth-provider";
import { NAME } from "./config";

const msalConfig = {
  auth: {
   clientId: "e3443e90-18bc-4a23-9982-7fd5e67ff339",
   authority: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
   validateAuthority: false,
   redirectUri: "http://localhost:3000/v2/login"
  },
  cache: {
   cacheLocation: "localStorage",
   storeAuthStateInCookie: true
  }
};

new Msal.UserAgentApplication(msalConfig);

const showIdps = (identityProviders) => {
  return identityProviders.map(idp => (
    <Button
      color="primary"
      type="submit"
      size="large"
      fullWidth
      key={idp.name}
      onClick={() => signIn(idp)}
    >
      Log in with {idp.name}
    </Button>
  ));
}

const Container = (props) => {
  const identityProviders = useSelector(state => selectIdentityProviders(state));
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <>
      <PageHeading title={i18n.t("login.title")} whiteHeading />
      <div className={css.loginForm}>
        {showIdps(identityProviders)}
        <Button
          color="primary"
          type="submit"
          size="large"
          fullWidth
          onClick={() => signOut()}
        >
          sign out
        </Button>
      </div>
    </>
  );
};

Container.displayName = NAME;

export default Container;
