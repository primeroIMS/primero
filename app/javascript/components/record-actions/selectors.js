export const selectDialog = (dialogType, state) => state.getIn(
  ["ui", "dialogs", dialogType],
  false
);

export const selectDialogPending = (state) => state.getIn(
  ["ui", "dialogs", "pending"],
  false
);
