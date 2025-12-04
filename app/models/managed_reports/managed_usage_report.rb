# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.
class ManagedReports::ManagedUsageReport < ManagedReport
  attr_accessor :subreport

  def build_report(user, filters = [], _opts = {})
    self.user = user
    self.filters = filters
    self.subreport = ManagedReports::SubReports::DistributionUsersRole.new.tap do |current|
      current.build_report(user, subreport_params(filters))
    end
    self.data = { subreport.id => subreport.data }
  end

  def exporter
    Exporters::UsageReportExporter
  end
end
