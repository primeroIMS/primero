// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

    expect(transformFilters.combine(data)).toEqual(expected);
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

    expect(transformFilters.combine(data)).toEqual(expected);
  });

  it("does not combines violation_category and verification_status if only violation_category is present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"]
    };

    expect(transformFilters.combine(data)).toEqual(data);
  });

  it("does not combines violation_category and verification_status if only verification_status is present", () => {
    const data = {
      record_state: ["true"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(transformFilters.combine(data)).toEqual(data);
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

    expect(transformFilters.split(data)).toEqual(expected);
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

    expect(transformFilters.split(data)).toEqual(expected);
  });

  it("does not split the violation_category and verification_status if only violation_category is present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"]
    };

    expect(transformFilters.split(data)).toEqual(data);
  });

  it("does not split the violation_category and verification_status if only verification_status is present", () => {
    const data = {
      record_state: ["true"],
      verification_status: ["verified", "report_pending_verification"]
    };

    expect(transformFilters.split(data)).toEqual(data);
  });

  it("combines violation_category and weapon_type if both are present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["killing", "maiming"],
      weapon_type: ["hanging", "small_arm"]
    };

    const expected = {
      record_state: ["true"],
      violation_with_weapon_type: ["killing_hanging", "killing_small_arm", "maiming_hanging", "maiming_small_arm"]
    };

    expect(transformFilters.combine(data)).toEqual(expected);
  });

  it("combines violation_category and facility_impact if both are present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["military_use", "attack_on_schools"],
      facility_impact: ["minor_damage", "serious_damage"]
    };

    const expected = {
      record_state: ["true"],
      violation_with_facility_impact: [
        "military_use_minor_damage",
        "military_use_serious_damage",
        "attack_on_schools_minor_damage",
        "attack_on_schools_serious_damage"
      ]
    };

    expect(transformFilters.combine(data)).toEqual(expected);
  });

  it("combines violation_category and facility_attack_type if both are present", () => {
    const data = {
      record_state: ["true"],
      violation_category: ["attack_on_hospitals", "attack_on_schools"],
      facility_attack_type: ["other_interference_with_healthcare", "other_interference_with_education"]
    };

    const expected = {
      record_state: ["true"],
      violation_with_facility_attack_type: [
        "attack_on_hospitals_other_interference_with_healthcare",
        "attack_on_hospitals_other_interference_with_education",
        "attack_on_schools_other_interference_with_healthcare",
        "attack_on_schools_other_interference_with_education"
      ]
    };

    expect(transformFilters.combine(data)).toEqual(expected);
  });

  it("splits the violation_with_weapon_type filter", () => {
    const data = {
      record_state: ["true"],
      violation_with_weapon_type: ["killing_hanging", "killing_small_arm"]
    };

    const expected = {
      record_state: ["true"],
      violation_category: ["killing"],
      weapon_type: ["hanging", "small_arm"]
    };

    expect(transformFilters.split(data)).toEqual(expected);
  });

  it("splits the violation_with_facility_impact filter", () => {
    const data = {
      record_state: ["true"],
      violation_with_facility_impact: ["military_use_minor_damage", "military_use_serious_damage"]
    };

    const expected = {
      record_state: ["true"],
      violation_category: ["military_use"],
      facility_impact: ["minor_damage", "serious_damage"]
    };

    expect(transformFilters.split(data)).toEqual(expected);
  });

  it("splits the violation_with_facility_attack_type filter", () => {
    const data = {
      record_state: ["true"],
      violation_with_facility_attack_type: [
        "attack_on_hospitals_other_interference_with_healthcare",
        "attack_on_hospitals_other_interference_with_education"
      ]
    };

    const expected = {
      record_state: ["true"],
      violation_category: ["attack_on_hospitals"],
      facility_attack_type: ["other_interference_with_healthcare", "other_interference_with_education"]
    };

    expect(transformFilters.split(data)).toEqual(expected);
  });
});
