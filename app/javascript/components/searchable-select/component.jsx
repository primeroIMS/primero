import React from "react";
import CustomAutoComplete from "./parts/custom-auto-complete";

const SearchableSelect = props => {
  return <CustomAutoComplete {...{ props }} />;
};

export default SearchableSelect;
