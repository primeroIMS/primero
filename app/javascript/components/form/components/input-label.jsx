import PropTypes from "prop-types";
import Dompurify from "dompurify";

import Tooltip from "../../tooltip";

const InputLabel = ({ tooltip, i18nTitle, text, boldText }) => {
  const sanitizer = Dompurify.sanitize;
  const boldString = (str, substr) => str.replace(RegExp(substr, "g"), `<b>${substr}</b>`);

  if (boldText) {
    return (
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sanitizer(boldString(text, boldText)) }}
      />
    );
  }

  return (
    <Tooltip title={tooltip} i18nTitle={i18nTitle}>
      <span>{text}</span>
    </Tooltip>
  );
};

InputLabel.displayName = "InputLabel";

InputLabel.defaultProps = {
  boldText: "",
  i18nTitle: false,
  text: "",
  tooltip: ""
};

InputLabel.propTypes = {
  boldText: PropTypes.string,
  i18nTitle: PropTypes.bool,
  text: PropTypes.string,
  tooltip: PropTypes.string
};

export default InputLabel;
