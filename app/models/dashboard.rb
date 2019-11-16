class Dashboard < ValueObject
  attr_accessor :name, :type, :indicators

  CASE_OVERVIEW = Dashboard.new(
    name: 'case_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN, Indicators::Case::UPDATED,
      Indicators::Case::CLOSED_RECENTLY
    ]
  ).freeze
end