import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import PrintIcon from "@material-ui/icons/Print";
import CheckIcon from "@material-ui/icons/Check";

import { ROUTES } from "../../config";
import TranslationsToggle from "../translations-toggle";
import ModuleLogo from "../module-logo";
import { useI18n } from "../i18n";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = () => {
  const css = useStyles();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const codeOfConductAccepted = false;
  const primeroModule = "cp";

  if (codeOfConductAccepted) {
    dispatch(push(ROUTES.dashboard));
  }

  return (
    <div className={css.container}>
      <ModuleLogo moduleLogo={primeroModule} white />
      <div className={css.content}>
        <div className={css.details}>
          <h2>{i18n.t("code_of_conduct")}</h2>
          <p>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in libero in quam sollicitudin scelerisque.
            Aenean egestas libero tempor rutrum dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque dictum tempus eleifend. Duis hendrerit efficitur leo. Vivamus efficitur ligula et efficitur
            sollicitudin. Donec at libero tincidunt nunc finibus mollis. Donec scelerisque, magna in aliquet dapibus,
            tortor nisl tincidunt massa, in faucibus nulla orci quis lorem. Vivamus sit amet ultricies ex, in laoreet
            nisi. Curabitur scelerisque erat nulla, ac laoreet orci euismod congue. Aenean eget auctor elit. Fusce nec
            ipsum in mauris viverra varius. Donec bibendum et dui vitae pulvinar. Maecenas iaculis nulla sed volutpat
            dapibus. Praesent cursus cursus quam, at vestibulum mauris porttitor in. Fusce pharetra convallis justo, nec
            lobortis nunc. Donec nec quam finibus, hendrerit purus nec, faucibus erat. Pellentesque sit amet mi
            eleifend, mollis tortor at, pellentesque leo. Aliquam erat volutpat. Sed viverra at purus quis accumsan.
          </p>
        </div>
        <div className={css.actions}>
          <ActionButton
            icon={<ClearIcon />}
            text={i18n.t("buttons.cancel")}
            type={ACTION_BUTTON_TYPES.default}
            isTransparent
            rest={{
              onClick: () => console.log("TODO")
            }}
          />
          <ActionButton
            icon={<PrintIcon />}
            text={i18n.t("buttons.print")}
            type={ACTION_BUTTON_TYPES.default}
            outlined
            rest={{
              onClick: () => console.log("TODO")
            }}
          />
          <ActionButton
            icon={<CheckIcon />}
            text={i18n.t("buttons.accept")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: () => console.log("TODO")
            }}
          />
        </div>
      </div>
      <div className={css.translationToogle}>
        <TranslationsToggle />
      </div>
    </div>
  );
};

Component.displayName = NAME;

export default Component;
