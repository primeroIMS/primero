import { fireEvent, waitFor, within } from "@testing-library/react";

async function setSelectValue(autocomplete, value) {
  const input = within(autocomplete).getByRole("textbox");

  if (!value) {
    return input;
  }

  autocomplete.focus();
  fireEvent.change(input, { target: { value } });
  await waitFor();
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  await waitFor();
  fireEvent.keyDown(autocomplete, { key: "Enter" });
  await waitFor();

  return input;
}

export default setSelectValue;
