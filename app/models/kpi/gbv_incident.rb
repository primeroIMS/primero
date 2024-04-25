# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Module for capturing all of the GBV Kpi related logic for the Child model
module Kpi::GBVIncident
  extend ActiveSupport::Concern

  included do
    if Rails.configuration.solr_enabled
      searchable do
        %w[id status].each { |f| string(f, as: "#{f}_sci") }
        integer :reporting_delay_days
        date :date_of_first_report
      end
    end
  end

  delegate :reporting_delay_days, to: :kpis, allow_nil: true

  private

  def kpis
    @kpis ||= GBVKpiCalculationService.from_record(self)
  end
end
