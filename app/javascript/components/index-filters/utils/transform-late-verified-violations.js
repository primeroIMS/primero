// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default {
  name: "late_verified_violations",
  filters: ["violation_category", "has_late_verified_violations"],
  combine(data) {
    return { [this.name]: data.violation_category };
  },
  split(data) {
    const lateVerifiedViolations = data[this.name];

    return {
      violation_category: lateVerifiedViolations,
      has_late_verified_violations: [true]
    };
  }
};
