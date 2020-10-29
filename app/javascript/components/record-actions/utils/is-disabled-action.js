import { ALL, MANY, ONE } from "../constants";

export default (enabledFor, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords) => {
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat().length;
  const forOne = enabledFor?.includes(ONE);
  const forMany = enabledFor?.includes(MANY);
  const forAll = enabledFor?.includes(ALL);

  const enableForOne = enabledOnSearch
    ? selectedRecordsLength === 1 && forOne && enabledOnSearch && isSearchFromList
    : selectedRecordsLength === 1 && forOne;
  const enableForMany = selectedRecordsLength > 1 && selectedRecordsLength !== totaRecords && forMany;
  const enableForAll = selectedRecordsLength === totaRecords && forAll;

  return !(selectedRecordsLength > 0 && (enableForOne || enableForMany || enableForAll));
};
