// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { VIOLATION_TYPE } from "../../../config";

export default ({ name, filters }) => ({
  name,
  filters,
  combine(data) {
    const combinedFilters = data.violation_category.reduce((acc, violationCategory) => {
      const combined = data[this.filters[1]].map(verificationStatus => `${violationCategory}_${verificationStatus}`);

      return [...acc, ...combined];
    }, []);

    return { [this.name]: combinedFilters };
  },
  split(data) {
    const violationTypes = Object.values(VIOLATION_TYPE);
    const violationWithVerificationStatus = data[this.name];

    const splittedFilters = violationWithVerificationStatus.reduce(
      (acc, elem) => {
        const violationType = violationTypes.find(type => elem.startsWith(type));

        if (violationType) {
          const filterValue = elem.replace(`${violationType}_`, "");

          if (filterValue) {
            if (!acc.violation_category.includes(violationType)) {
              acc.violation_category = [...acc.violation_category, violationType];
            }

            if (!acc[this.filters[1]].includes(filterValue)) {
              acc[this.filters[1]] = [...acc[this.filters[1]], filterValue];
            }
          }
        }

        return acc;
      },
      { violation_category: [], [this.filters[1]]: [] }
    );

    return splittedFilters;
  }
});
