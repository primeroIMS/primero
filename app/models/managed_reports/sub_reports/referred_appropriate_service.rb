# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Describes ReferredAppropiateService subreport in Primero.
class ManagedReports::SubReports::ReferredAppropriateService < ManagedReports::SubReport
  def id
    'referred_appropriate_service'
  end

  def indicators
    [
      ManagedReports::Indicators::CaseReferredAppropriateService
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::CaseReferredAppropriateService.id => 'lookup-service-type'
    }
  end

  def indicators_subcolumns
    { ManagedReports::Indicators::CaseReferredAppropriateService.id => 'lookup-gender' }.freeze
  end
end
