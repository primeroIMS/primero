import { useDispatch } from "react-redux";
import { Button } from "@material-ui/core";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";
import { useMemoizedSelector } from "../../../../libs";

import { attemptIDPLogin } from "./action-creators";
import { getIdentityProviders } from "./selectors";
import { signIn } from "./auth-provider";
import { NAME } from "./config";
import css from "./styles.css";
import { PRIMERO_IDP } from "./constants";
import PrimeroIdpLink from "./components/primero-idp-link";

const showIdps = (identityProviders, dispatch) => {
  const tokenCallback = accessToken => {
    dispatch(attemptIDPLogin(accessToken));
  };

  const handleClick = idp => () => {
    signIn(idp, tokenCallback);
  };

  return identityProviders.map(idp => {
    const uniqueID = idp.get("unique_id");

    if (uniqueID === PRIMERO_IDP && identityProviders.size > 1) {
      return null;
    }

    return (
      <Button
        id={`idp-button-${uniqueID}`}
        color="primary"
        type="submit"
        size="large"
        fullWidth
        key={idp.get("name")}
        onClick={handleClick(idp)}
      >
        {idp.get("name")}
      </Button>
    );
  });
};

const Container = () => {
  const i18n = useI18n();

  const dispatch = useDispatch();

  const identityProviders = useMemoizedSelector(state => getIdentityProviders(state));

  return (
    <>
      <PageHeading title={i18n.t("login.title")} />
      <p className={css.selectProvider}>{i18n.t("select_provider")}</p>
      <div className={`${css.loginSelection} loginSelection`}>{showIdps(identityProviders, dispatch)}</div>
      <PrimeroIdpLink identityProviders={identityProviders} i18n={i18n} dispatch={dispatch} css={css} />
    </>
  );
};

Container.displayName = NAME;

export default Container;
