import isNewApproval from "./is-new-approval";

describe("isNewApproval", () => {
  it("return true if is approval request", () => {
    const source = [
      {
        approval_date: "2021-01-07",
        approval_requested_for: "assessment",
        requested_by: "primero"
      }
    ];

    expect(isNewApproval(source)).to.be.true;
  });
  it("return false if is not approval request", () => {
    const source = [
      {
        approval_date: "2021-01-07",
        approval_requested_for: "assessment",
        requested_by: "primero",
        unique_id: "318c90df-fb25-454a-b250-10665e3bed11"
      }
    ];

    expect(isNewApproval(source)).to.be.false;
  });
});
