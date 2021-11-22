import { IconButton } from "@material-ui/core";
import MenuOpen from "@material-ui/icons/MenuOpen";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";

import { GuidingQuestions } from "./components";
import css from "./styles.css";

const RecordFormTitle = ({ displayText, handleToggleNav, mobileDisplay, subTitle, subTitleGuidance, mode }) => {
  const i18n = useI18n();
  const showMobileIcon = mobileDisplay ? (
    <IconButton onClick={handleToggleNav}>
      <MenuOpen />
    </IconButton>
  ) : null;

  const renderSubTitle = subTitle ? (
    <div className={css.formSubtitle}>
      <h3>{subTitle}</h3>
    </div>
  ) : null;

  const renderGuidingQuestions = subTitleGuidance && (mode.isEdit || mode.isNew) && subTitleGuidance[i18n.locale] && (
    <GuidingQuestions label={i18n.t("buttons.guidance")} text={subTitleGuidance[i18n.locale]} />
  );

  return (
    <>
      <div className={css.formTitle}>
        {showMobileIcon}
        <span className={css.formHeading}>{displayText}</span>
      </div>
      {renderSubTitle}
      {renderGuidingQuestions}
    </>
  );
};

RecordFormTitle.displayName = "RecordFormTitle";

RecordFormTitle.propTypes = {
  displayText: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  subTitle: PropTypes.string,
  subTitleGuidance: PropTypes.string
};

export default RecordFormTitle;
