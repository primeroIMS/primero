# frozen_string_literal: true

# Locations CRUD API
class Api::V2::LocationsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Import

  def index
    authorize! :index, Location
    filters = locations_filters(params.permit(disabled: {}))
    filtered_locations = Location.list(filters)
    @total = filtered_locations.size
    @locations = filtered_locations.paginate(pagination)
    @with_hierarchy = params[:hierarchy] == 'true'
  end

  def create
    authorize! :create, Location
    @location = Location.new_with_properties(location_params)
    @location.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def show
    authorize! :show, Location
    @location = Location.find(params[:id])
  end

  def update
    authorize! :update, Location
    @location = Location.find(params[:id])
    @location.update_properties(location_params)
    @location.save!
    render 'show'
  end

  def destroy
    authorize! :enable_disable_record, Location
    @location = Location.find(params[:id])
    @location.destroy!
  end

  def per
    @per ||= (params[:per]&.to_i || 100)
  end

  protected

  def locations_filters(params)
    return if params.blank?

    { disabled: params[:disabled].values }
  end

  def location_params
    params.require(:data).permit(:id, :code, :admin_level, :type, :parent_code, placename: {})
  end

  def importer
    Importers::CsvHxlLocationImporter
  end
end
