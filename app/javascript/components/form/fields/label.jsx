import React from "react";
import PropTypes from "prop-types";

const Label = ({ commonInputProps }) => {
  const { label, className, boldWords, phraseParts } = commonInputProps;

  const renderPhrase = () => {
    return phraseParts.map(part => {
      const classNameElement = boldWords.includes(part) ? className : "";
      const key = part.replace(/\s/g, "");

      return (
        <span key={key} className={classNameElement}>
          {part}{" "}
        </span>
      );
    });
  };

  const labelToRender = phraseParts ? renderPhrase() : label;

  return <div>{labelToRender}</div>;
};

Label.displayName = "Label";

Label.propTypes = {
  commonInputProps: PropTypes.shape({
    boldWords: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    className: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    label: PropTypes.string,
    phraseParts: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  })
};

export default Label;
