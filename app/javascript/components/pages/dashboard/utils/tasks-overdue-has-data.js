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
