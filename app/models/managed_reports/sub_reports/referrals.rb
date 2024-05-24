# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a Referrals subreport
class ManagedReports::SubReports::Referrals < ManagedReports::SubReport
  def id
    'referrals'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentsFirstPointOfContact,
      ManagedReports::Indicators::IncidentsFromOtherServiceProvider,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvided,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther
    ].freeze
  end
end
