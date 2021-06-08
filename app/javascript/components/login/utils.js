import { DEMO } from "../application/constants";

const loginComponentText = (i18n, demo = false) => {
  const title = i18n.t("login.label");
  const actionButton = i18n.t("buttons.login");

  return {
    title: demo ? `${i18n.t(DEMO)} ${title}` : title,
    actionButton: demo ? `${actionButton} ${i18n.t("logger.to")} ${i18n.t(DEMO)}` : actionButton
  };
};

export default {
  loginComponentText
};
