import { useDispatch } from "react-redux";

import { PageHeading } from "../../../page";
import { useI18n } from "../../../i18n";
import { useMemoizedSelector } from "../../../../libs";

import { getIdentityProviders } from "./selectors";
import { NAME } from "./config";
import css from "./styles.css";
import PrimeroIdpLink from "./components/primero-idp-link";
import PrimeroIdpSelect from "./components/primero-idp-select";

const Container = () => {
  const i18n = useI18n();

  const dispatch = useDispatch();

  const identityProviders = useMemoizedSelector(state => getIdentityProviders(state));

  return (
    <>
      <PageHeading title={i18n.t("login.title")} noPadding noElevation />
      <PrimeroIdpSelect identityProviders={identityProviders} css={css} />
      <PrimeroIdpLink identityProviders={identityProviders} i18n={i18n} dispatch={dispatch} css={css} />
    </>
  );
};

Container.displayName = NAME;

export default Container;
