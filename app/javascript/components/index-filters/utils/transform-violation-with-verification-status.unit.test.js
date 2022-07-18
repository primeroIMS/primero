describe("<IndexFilters>/utils - buildNameFilter", () => {
  it("combines violation_category and verification_status if both are present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"],
      verification_status: ["verified", "report_pending_verification"]
    };

    const expected = {
      record_state: ["true"],
      violation_with_verification_status: [
        "killing_verified",
        "killing_report_pending_verification",
        "maiming_verified",
        "maiming_report_pending_verification"
      ]
    };

    expect(combineFilters(data)).to.deep.equal(expected);
  });

  it("does not combines violation_category and verification_status if only violation_category is present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"]
    };

    expect(combineFilters(data)).to.deep.equal(data);
  });

  it("does not combines violation_category and verification_status if only verification_status is present", () => {
    const data = {
      record_state: ["true"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(combineFilters(data)).to.deep.equal(data);
  });
});
