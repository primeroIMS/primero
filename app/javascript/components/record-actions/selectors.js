export const selectDialog = (state, dialogType) =>
  state.getIn(["ui", "dialogs", dialogType], false);

export const selectDialogPending = state =>
  state.getIn(["ui", "dialogs", "pending"], false);
