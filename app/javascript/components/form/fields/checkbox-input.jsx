import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox
} from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

import Input from "../components/input";

const CheckboxInput = ({ field }) => {
  // const renderOptions = methods => {
  //   const {
  //     inputOptions,
  //     fieldName,
  //     handleChange,
  //     isObject,
  //     inputValue,
  //     optionText,
  //     i18n
  //   } = methods;

  //   console.log(methods);

  //   return inputOptions.map(option => {
  //     return (
  //       <FormControlLabel
  //         key={`${fieldName}-${option.id}`}
  //         control={
  //           <Checkbox
  //             onChange={handleChange}
  //             value={option.id}
  //             checked={
  //               isObject
  //                 ? option.key in inputValue
  //                 : inputValue.includes(option.id)
  //             }
  //           />
  //         }
  //         label={optionText(option, i18n)}
  //       />
  //     );
  //   });

  // };

  // return (
  //   <Input field={field}>
  //     {methods => (
  //       <FormControl component="fieldset">
  //         <FormGroup>{renderOptions(methods)}</FormGroup>
  //       </FormControl>
  //     )}
  //   </Input>
  // );

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      onChange={(v) => {
        console.log(v);

        // React Select return object instead of value for selection
        return { value: v };
      }}
      as={
        <FormControl>
          <FormGroup>
            <FormControlLabel
              label="test"
              control={<Checkbox value="test" />}
            />
            <FormControlLabel
              label="test2"
              control={<Checkbox value="test2" />}
            />
            <FormControlLabel
              label="test3"
              control={<Checkbox value="test3" />}
            />
          </FormGroup>
        </FormControl>
      }
      name={field.name}
    />
  );
};

CheckboxInput.displayName = "CheckboxInput";

CheckboxInput.propTypes = {
  field: PropTypes.object.isRequired
};

export default CheckboxInput;
