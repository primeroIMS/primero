# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases by Risk Level in Primero.
class ManagedReports::SubReports::CaseRiskLevel < ManagedReports::SubReport
  def id
    'case_risk_level'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageCasesRiskLevel
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::PercentageCasesRiskLevel.id => 'lookup-risk-level'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageCasesRiskLevel.id => 'lookup-gender-identity'
    }
  end
end
