// eslint-disable-next-line import/prefer-default-export
export const isDisabledAction = (enabledFor, selectedRecords, totaRecords) => {
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()
    .length;
  const forOne = enabledFor?.includes("one");
  const forMany = enabledFor?.includes("many");
  const forAll = enabledFor?.includes("all");

  return !(
    selectedRecordsLength > 0 &&
    ((selectedRecordsLength === 1 && forOne) ||
      (selectedRecordsLength > 1 &&
        selectedRecordsLength !== totaRecords &&
        forMany) ||
      (selectedRecordsLength === totaRecords && forAll))
  );
};
