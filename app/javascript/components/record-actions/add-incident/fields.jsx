import React from "react";
import PropTypes from "prop-types";

import { TextField } from "../../record-form";

// eslint-disable-next-line react/display-name
const Fields = ({ fields }) => {
  console.log(fields);

  return (
    <>
      {fields &&
        fields.map(field => {
          const Field = (fieldType => {
            switch (fieldType) {
              case "text_field":
                return TextField;
              default:
                return TextField;
            }
          })(field.type);

          const fieldProps = {
            field,
            rest: {
              mode: {
                isShow: false
              }
            }
          };

          return <Field key={field.name} {...fieldProps} />;
        })}
    </>
  );
};

Fields.propTypes = {
  fields: PropTypes.array
};

export default Fields;
