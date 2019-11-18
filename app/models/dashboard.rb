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

end