/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";

import { attemptLogin } from "./action-creators";
import { getIdentityProviders } from "./selectors";
import { signIn } from "./auth-provider";
import { NAME } from "./config";
import styles from "./styles.css";

const showIdps = (identityProviders, i18n, dispatch, css) => {
  const tokenCallback = accessToken => {
    dispatch(attemptLogin(accessToken));
  };

  return identityProviders.map(idp => {
    if (idp.get("unique_id") === "primeroims") {
      return (
        <div className={css.linkButtonContainer}>
          <span>{i18n.t("or_label")}</span>
          <Link component="a" variant="body2" onClick={() => signIn(idp, tokenCallback)}>
            {`log in with ${idp.get("name")} username`}
          </Link>
        </div>
      );
    }

    return (
      <Button
        className="provider-login"
        color="primary"
        type="submit"
        size="large"
        fullWidth
        key={idp.get("name")}
        onClick={() => signIn(idp, tokenCallback)}
      >
        {idp.get("name")}
      </Button>
    );
  });
};

const Container = () => {
  const identityProviders = useSelector(state => getIdentityProviders(state));
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  return (
    <>
      <PageHeading title={i18n.t("login.title")} whiteHeading />
      <p className={css.selectProvider}>{i18n.t("select_provider")}</p>
      <div className={`${css.loginSelection} loginSelection`}>{showIdps(identityProviders, i18n, dispatch, css)}</div>
    </>
  );
};

Container.displayName = NAME;

export default Container;
