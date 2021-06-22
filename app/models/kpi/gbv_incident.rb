# frozen_string_literal: true

# Module for capturing all of the GBV Kpi related logic for the Child model
module Kpi::GBVIncident
  extend ActiveSupport::Concern

  included do
    searchable do
      integer :reporting_delay_days
      date :date_of_first_report
    end
  end

  delegate :reporting_delay_days, to: :kpis, allow_nil: true

  private

  def kpis
    @kpis ||= GbvKpiCalculationService.from_record(self)
  end
end
