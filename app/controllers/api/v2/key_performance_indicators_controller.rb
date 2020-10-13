# frozen_string_literal: true

# Controller for Key Performance Indicator Metrics
#
# Making Changes:
#
#   KPIs exist as queries against Solr and Postgres. These queries make use
#   of Sunspot and ActiveRecord respectively. They reside either:
#
#   * in the appropriately named Controller method e.g.
#     Number of Incidents is found at
#     KeyPerformanceIndicatorsController#number_of_incidents
#   * in the associated Concern GBVKeyPerformanceIndicators under the
#     Searches Module.
#
# **This code is currently in flux** as the proper query technolog
# (Solr, Postgres) is yet to be solidified and the proper architecture is yet
# to be defined in totality.
#
class Api::V2::KeyPerformanceIndicatorsController < ApplicationApiController
  def show
    search_klass = KPI::Search.find(kpi_id)
    search = search_klass.new(from, to)
    @data = search.to_json
  end

  private

  def kpi_id
    params[:id]
  end

  def from
    Sunspot::Type.for_class(Date).to_indexed(params[:from])
  end

  def to
    Sunspot::Type.for_class(Date).to_indexed(params[:to])
  end
end
