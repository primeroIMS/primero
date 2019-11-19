class Dashboard < ValueObject
  attr_accessor :name, :type, :indicators

  # Note: The constant name of each Dashboard needs to match the value of the corresponding Permission

  CASE_OVERVIEW = Dashboard.new(
    name: 'case_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN, Indicators::Case::UPDATED,
      Indicators::Case::CLOSED_RECENTLY
    ]
  ).freeze

  WORKFLOW = Dashboard.new(
    name: 'workflow',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW]
  ).freeze

  WORKFLOW_TEAM = Dashboard.new(
    name: 'workflow_team',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW_TEAM]
  ).freeze

  CASE_RISK = Dashboard.new(
    name: 'case_risk',
    type: 'indicator',
    indicators: [Indicators::Case::RISK]
  ).freeze

  APPROVALS_ASSESSMENT = Dashboard.new(
    name: 'approvals_assessment',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_ASSESSMENT_PENDING,
      Indicators::Case::APPROVALS_ASSESSMENT_REJECTED,
      Indicators::Case::APPROVALS_ASSESSMENT_APPROVED
    ]
  ).freeze

  APPROVALS_CASE_PLAN = Dashboard.new(
    name: 'approvals_case_plan',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CASE_PLAN_PENDING,
      Indicators::Case::APPROVALS_CASE_PLAN_REJECTED,
      Indicators::Case::APPROVALS_CASE_PLAN_APPROVED
    ]
  ).freeze

  APPROVALS_CLOSURE = Dashboard.new(
    name: 'approvals_closure',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CLOSURE_PENDING,
      Indicators::Case::APPROVALS_CLOSURE_REJECTED,
      Indicators::Case::APPROVALS_CLOSURE_APPROVED
    ]
  ).freeze



end