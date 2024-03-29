// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (
  casesByTaskOverdueAssessment,
  casesByTaskOverdueCasePlan,
  casesByTaskOverdueServices,
  casesByTaskOverdueFollowups
) => {
  return (
    !!casesByTaskOverdueAssessment.size ||
    !!casesByTaskOverdueCasePlan.size ||
    !!casesByTaskOverdueServices.size ||
    !!casesByTaskOverdueFollowups.size
  );
};
