import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { setSelectedForm } from "../../action-creators";

import { NAME, LINK_NAME } from "./constants";
import css from "./styles.css";

const LINK_TOKEN = `%{${LINK_NAME}}`;

const splitAroundLink = message => {
  const parts = message.split(LINK_TOKEN);

  return parts.length > 1 ? parts : [`${parts[0]} `, ""];
};

function Component({ messageKey, linkKey, formUniqueId }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [messageStart, messageEnd] = splitAroundLink(i18n.t(messageKey, { [LINK_NAME]: LINK_TOKEN }));

  const navigateToForm = event => {
    event.stopPropagation();
    dispatch(setSelectedForm(formUniqueId));
  };

  const handleKeyDown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToForm(event);
    }
  };

  return (
    <>
      {messageStart}
      <span className={css.link} role="button" tabIndex={0} onClick={navigateToForm} onKeyDown={handleKeyDown}>
        {i18n.t(linkKey)}
      </span>
      {messageEnd}
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formUniqueId: PropTypes.string.isRequired,
  linkKey: PropTypes.string.isRequired,
  messageKey: PropTypes.string.isRequired
};

export default Component;
