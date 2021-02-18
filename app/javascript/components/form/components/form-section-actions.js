import PropTypes from "prop-types";

import ActionButton from "../../action-button";

const FormSectionActions = ({ actions, css }) => {
  if (!actions?.length) return null;

  return (
    <div className={css.formActions}>
      {actions.map(action => (
        <ActionButton key={action.text} {...action} />
      ))}
    </div>
  );
};

FormSectionActions.propTypes = {
  actions: PropTypes.array,
  css: PropTypes.object
};

FormSectionActions.displayName = "FormSectionActions";

export default FormSectionActions;
