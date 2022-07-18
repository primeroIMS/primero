import transformFilters from "./transform-filters";

describe("<IndexFilters>/utils - transformFilters", () => {
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

    expect(transformFilters.combine(data)).to.deep.equal(expected);
  });

  it("combines violation_category and has_late_verified_violations if both are present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"],
      has_late_verified_violations: ["true"]
    };

    const expected = {
      record_state: ["true"],
      late_verified_violations: ["killing", "maiming"]
    };

    expect(transformFilters.combine(data)).to.deep.equal(expected);
  });

  it("does not combines violation_category and verification_status if only violation_category is present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"]
    };

    expect(transformFilters.combine(data)).to.deep.equal(data);
  });

  it("does not combines violation_category and verification_status if only verification_status is present", () => {
    const data = {
      record_state: ["true"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(transformFilters.combine(data)).to.deep.equal(data);
  });

  it("splits the violation_with_verification_status filter", () => {
    const data = {
      record_state: ["true"],
      violation_with_verification_status: [
        "killing_verified",
        "killing_report_pending_verification",
        "maiming_verified",
        "maiming_report_pending_verification"
      ]
    };

    const expected = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(transformFilters.split(data)).to.deep.equal(expected);
  });

  it("splits late_verified_violations filter", () => {
    const data = {
      record_state: ["true"],
      late_verified_violations: ["killing", "maiming"]
    };

    const expected = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"],
      has_late_verified_violations: [true]
    };

    expect(transformFilters.split(data)).to.deep.equal(expected);
  });

  it("does not split the violation_category and verification_status if only violation_category is present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"]
    };

    expect(transformFilters.split(data)).to.deep.equal(data);
  });

  it("does not split the violation_category and verification_status if only verification_status is present", () => {
    const data = {
      record_state: ["true"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(transformFilters.split(data)).to.deep.equal(data);
  });
});
