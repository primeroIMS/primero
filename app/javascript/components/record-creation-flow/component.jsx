import { useState } from "react";
import PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { useI18n } from "../i18n";

import { ConsentPrompt, SearchPrompt } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ open, onClose, recordType }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const canSearchAndCreate = true;
  const [openConsentPrompt, setOpenConsentPrompt] = useState(false);

  const handleSkipAndCreate = () => setOpenConsentPrompt(true);
  const handleCloseDrawer = isConsentPromptOpen => {
    if (isConsentPromptOpen) {
      setOpenConsentPrompt(false);
    } else {
      onClose();
      setOpenConsentPrompt(false);
    }
  };

  const renderSearchPrompt = canSearchAndCreate && !openConsentPrompt && (
    <SearchPrompt
      setOpenConsentPrompt={setOpenConsentPrompt}
      i18n={i18n}
      recordType={recordType}
      onCloseDrawer={() => handleCloseDrawer(false)}
    />
  );
  const renderSkipAndCreate = !openConsentPrompt && (
    <div className={css.skipButtonContainer}>
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("case.skip_and_create")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleSkipAndCreate
        }}
      />
    </div>
  );
  const renderConsentPrompt = openConsentPrompt && <ConsentPrompt />;

  return (
    <Drawer anchor="right" open={open} onClose={() => handleCloseDrawer(false)} classes={{ paper: css.subformDrawer }}>
      <div className={css.container}>
        <div className={css.title}>
          <h2>{i18n.t("case.create_new_case")}</h2>
          <ActionButton
            icon={<CloseIcon />}
            text={i18n.t("cancel")}
            type={ACTION_BUTTON_TYPES.icon}
            isTransparent
            rest={{
              className: css.button,
              onClick: () => handleCloseDrawer(openConsentPrompt)
            }}
          />
        </div>
        {renderSearchPrompt}
        {renderSkipAndCreate}
        {renderConsentPrompt}
      </div>
    </Drawer>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  recordType: PropTypes.string
};

export default Component;
