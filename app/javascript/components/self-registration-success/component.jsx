import { Link, Redirect } from "react-router-dom";

import { useI18n } from "../i18n";
import { useThemeHelper } from "../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../action-button";
import { PageHeading } from "../page";
import { ROUTES } from "../../config";
import { useApp } from "../application";

import css from "./styles.css";

function Component() {
  const i18n = useI18n();
  const { allowSelfRegistration } = useApp();
  const { mobileDisplay } = useThemeHelper();

  if (!allowSelfRegistration) {
    return <Redirect to={ROUTES.login} />;
  }

  return (
    <div>
      <PageHeading title={i18n.t("self_registration.success.header")} noPadding noElevation />
      <p className={css.successMessage}>{i18n.t("self_registration.success.text")}</p>
      <ActionButton
        text="self_registration.success.return_button"
        type={ACTION_BUTTON_TYPES.default}
        size="large"
        rest={{
          to: ROUTES.login,
          component: Link,
          fullWidth: mobileDisplay,
          className: css.registerButton
        }}
      />
    </div>
  );
}

Component.displayName = "SelfRegistrationSuccess";

export default Component;
