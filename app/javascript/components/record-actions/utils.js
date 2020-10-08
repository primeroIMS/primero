// eslint-disable-next-line import/prefer-default-export
export const isDisabledAction = (enabledFor, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords) => {
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat().length;
  const forOne = enabledFor?.includes("one");
  const forMany = enabledFor?.includes("many");
  const forAll = enabledFor?.includes("all");

  const enableForOne = enabledOnSearch
    ? selectedRecordsLength === 1 && forOne && enabledOnSearch && isSearchFromList
    : selectedRecordsLength === 1 && forOne;
  const enableForMany = selectedRecordsLength > 1 && selectedRecordsLength !== totaRecords && forMany;
  const enableForAll = selectedRecordsLength === totaRecords && forAll;

  return !(selectedRecordsLength > 0 && (enableForOne || enableForMany || enableForAll));
};

export const subformExists = (parentForm, subformName) =>
  // eslint-disable-next-line camelcase
  parentForm && parentForm.fields.find(field => field.name === subformName)?.subform_section_id;
