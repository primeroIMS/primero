import React from "react";
import {
  NoOptionsMessage,
  Control,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  MultiValue,
  Menu,
  CustomAutoComplete
} from "./parts";

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

const SearchableSelect = props => {
  return <CustomAutoComplete {...{ props, components }} />;
};

export default SearchableSelect;
