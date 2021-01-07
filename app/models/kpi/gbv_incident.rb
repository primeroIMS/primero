# frozen_string_literal: true

# Module for capturing all of the GBV KPI related logic for the Child model
module KPI::GBVIncident
  extend ActiveSupport::Concern

  included do
    searchable do
      integer :reporting_delay_days
    end
  end

  delegate :reporting_delay_days, to: :kpis

  private

  def kpis
    @kpis ||= GbvKpiCalculationService.new(self)
  end
end
