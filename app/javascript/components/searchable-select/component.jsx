import React from "react";

import { NAME } from "./constants";
import CustomAutoComplete from "./components/custom-auto-complete";

const SearchableSelect = props => {
  return <CustomAutoComplete {...{ props }} />;
};

SearchableSelect.displayName = NAME;

export default SearchableSelect;
