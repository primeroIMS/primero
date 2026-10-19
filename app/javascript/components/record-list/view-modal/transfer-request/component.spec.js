import { fromJS } from "immutable";
import { mountedComponent, screen, userEvent, waitFor } from "test-utils";

import TransferRequest from "./component";

describe("<TransferRequest />", () => {
  const currentRecord = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Name",
    name_last: "Last",
    name: "Name Last",
    owned_by: "primero"
  });

  const props = {
    caseId: "1234",
    currentRecord,
    open: true,
    setOpen: () => {}
  };

  it("should render ActionDialog", () => {
    mountedComponent(<TransferRequest {...props} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("keeps the dialog open when the server rejects the request", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      url: `/api/v2/cases/${currentRecord.get("id")}/transfer_requests`,
      ok: false,
      status: 422,
      json: jest.fn().mockResolvedValueOnce({
        errors: [
          {
            status: 422,
            detail: "transitioned_to",
            message: ["transition.errors.to_user_can_receive"]
          }
        ]
      })
    });

    mountedComponent(<TransferRequest {...props} />, fromJS({}), {}, [], {}, "", true);

    await user.type(screen.getByLabelText(/request_transfer.notes_label/i), "please transfer");
    await user.click(screen.getByText("request_transfer.submit_label"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
