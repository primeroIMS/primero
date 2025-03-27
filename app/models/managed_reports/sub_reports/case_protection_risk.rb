# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases by Protection Risk in Primero.
class ManagedReports::SubReports::CaseProtectionRisk < ManagedReports::SubReport
  def id
    'case_protection_risk'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageCasesProtectionRisk
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::PercentageCasesProtectionRisk.id => 'lookup-protection-risks'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageCasesProtectionRisk.id => 'lookup-gender-identity'
    }
  end
end
