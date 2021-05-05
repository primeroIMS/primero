# frozen_string_literal: true

# API endpoint for Agency CRUD
class Api::V2::AgenciesController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  before_action :load_agency, only: %i[show update destroy]

  def index
    authorize! :index, Agency
    filters = agency_filters(params.permit(:managed, disabled: {}))
    filter_agencies = Agency.list(filters)
    @total = filter_agencies.size
    @agencies = filter_agencies.paginate(pagination)
  end

  def show
    authorize! :read, @agency
  end

  def create
    authorize! :create, Agency
    @agency = Agency.new_with_properties(agency_params)
    @agency.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize! :update, @agency
    @agency.update_properties(agency_params)
    @agency.save!
  end

  def destroy
    authorize! :destroy, @agency
    @agency.update_properties(disabled: true)
    @agency.save!
  end

  def agency_params
    params.require(:data).permit(
      :id, :unique_id, :agency_code, :order, :telephone, :logo_enabled,
      :logo_full_base64, :logo_full_file_name, :logo_icon_base64, :logo_icon_file_name,
      :terms_of_use_file_name, :terms_of_use_base64, :terms_of_use_enabled,
      :disabled, :pdf_logo_option, :exclude_agency_from_lookups, services: [], name: {}, description: {}
    )
  end

  protected

  def agency_filters(params)
    return if params.blank?

    { disabled: params[:disabled].values, managed: params[:managed] }
  end

  def load_agency
    @agency = Agency.find(record_id)
  end
end
