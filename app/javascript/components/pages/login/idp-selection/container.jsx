import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";

import { attemptLogin } from "./action-creators";
import { getIdentityProviders } from "./selectors";
import { signIn } from "./auth-provider";
import { NAME } from "./config";
import styles from "./styles.css";

const showIdps = (identityProviders, i18n, dispatch) => {
  const tokenCallback = accessToken => {
    dispatch(attemptLogin(accessToken));
  };

  return identityProviders.map(idp => (
    <Button
      className="provider-login"
      color="primary"
      type="submit"
      size="large"
      fullWidth
      key={idp.get("name")}
      onClick={() => signIn(idp, tokenCallback)}
    >
      {i18n.t("login.provider_title", {
        provider: idp.get("name")
      })}
    </Button>
  ));
};

const Container = () => {
  const identityProviders = useSelector(state => getIdentityProviders(state));
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  return (
    <>
      <PageHeading title={i18n.t("login.title")} whiteHeading />
      <div className={`${css.loginSelection} loginSelection`}>
        {showIdps(identityProviders, i18n, dispatch)}
      </div>
    </>
  );
};

Container.displayName = NAME;

export default Container;
