import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { PENDING_TRANSITION_ALERTS } from "../../../../config";
import { useI18n } from "../../../i18n";
import { setSelectedForm } from "../../../record-form/action-creators";

import { NAME, LINK_PLACEHOLDER } from "./constants";
import css from "./styles.css";

const splitAroundLink = message => {
  const parts = message.split(LINK_PLACEHOLDER);

  return parts.length > 1 ? parts : [`${parts[0]} `, ""];
};

function Component({ transitionType }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { messageKey, linkKey, transitionFormUniqueId } = PENDING_TRANSITION_ALERTS[transitionType];
  const [messageStart, messageEnd] = splitAroundLink(i18n.t(messageKey, { link: LINK_PLACEHOLDER }));

  const navigateToTransitionForm = event => {
    event.stopPropagation();
    dispatch(setSelectedForm(transitionFormUniqueId));
  };

  const handleKeyDown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToTransitionForm(event);
    }
  };

  return (
    <>
      {messageStart}
      <span
        className={css.link}
        role="button"
        tabIndex={0}
        onClick={navigateToTransitionForm}
        onKeyDown={handleKeyDown}
      >
        {i18n.t(linkKey)}
      </span>
      {messageEnd}
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  transitionType: PropTypes.string.isRequired
};

export default Component;
