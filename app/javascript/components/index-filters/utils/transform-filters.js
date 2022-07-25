import omit from "lodash/omit";
import isNil from "lodash/isNil";

import transformLateVerifiedViolations from "./transform-late-verified-violations";
import transformFilterWithViolationType from "./transform-filter-with-violation-type";

const filterTransformations = [
  transformFilterWithViolationType({
    name: "violation_with_verification_status",
    filters: ["violation_category", "verification_status"]
  }),
  transformLateVerifiedViolations,
  transformFilterWithViolationType({
    name: "violation_with_weapon_type",
    filters: ["violation_category", "weapon_type"]
  }),
  transformFilterWithViolationType({
    name: "violation_with_facility_impact",
    filters: ["violation_category", "facility_impact"]
  }),
  transformFilterWithViolationType({
    name: "violation_with_facility_attack_type",
    filters: ["violation_category", "facility_attack_type"]
  })
];

export default {
  combine: data => {
    const applied = filterTransformations.filter(tr => tr.filters.every(filter => !isNil(data[filter])));

    return omit(
      applied.reduce((acc, transformation) => {
        return { ...acc, ...transformation.combine(data) };
      }, data),
      applied.flatMap(transformation => transformation.filters)
    );
  },
  split: data => {
    const applied = filterTransformations.filter(tr => !isNil(data[tr.name]));

    return omit(
      applied.reduce((acc, transformation) => {
        return { ...acc, ...transformation.split(data) };
      }, data),
      applied.map(transformation => transformation.name)
    );
  }
};
