import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import css from "./styles.css";

function Component({ href, label, text }) {
  return (
    <div className={css.subformLinkWrapper}>
      <div className={css.subformLinkLabel}>{label}</div>
      <NavLink to={href} className={css.subformLink}>
        {text}
      </NavLink>
    </div>
  );
}

Component.displayName = "SubformLink";

Component.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default Component;
