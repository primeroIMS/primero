# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a Perpetrators subreport
class ManagedReports::SubReports::Perpetrators < ManagedReports::SubReport
  def id
    'perpetrators'
  end

  def indicators
    [
      ManagedReports::Indicators::NumberOfPerpetrators,
      ManagedReports::Indicators::PerpetratorRelationship,
      ManagedReports::Indicators::PerpetratorAgeGroup,
      ManagedReports::Indicators::PerpetratorOccupation
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::NumberOfPerpetrators.id => 'lookup-number-of-perpetrators',
      ManagedReports::Indicators::PerpetratorRelationship.id => 'lookup-perpetrator-relationship',
      ManagedReports::Indicators::PerpetratorAgeGroup.id => 'lookup-perpetrator-age-group',
      ManagedReports::Indicators::PerpetratorOccupation.id => 'lookup-perpetrator-occupation'
    }.freeze
  end
end
