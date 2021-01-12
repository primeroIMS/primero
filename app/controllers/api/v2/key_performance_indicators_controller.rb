# frozen_string_literal: true

# KeyPerformanceIndicatorsController
#
# Handles requests for Kpis
class Api::V2::KeyPerformanceIndicatorsController < ApplicationApiController
  def show
    authorize! kpi_permission, Kpi
    search_klass = Kpi::Search.find(kpi_id)
    search = search_klass.new(
      from,
      to,
      current_user.user_group_unique_ids,
      current_user.agency.unique_id
    )
    @data = search.to_json
  end

  private

  def kpi_permission
    "kpi_#{kpi_id}".to_sym
  end

  def kpi_id
    params[:id]
  end

  def from
    Sunspot::Type.for_class(Date).to_indexed(params[:from])
  end

  def to
    Sunspot::Type.for_class(Date).to_indexed(params[:to])
  end

  # prevent the audit log thinking we're working with an active record object.
  def audit_params
    { record_id: nil }
  end
end
