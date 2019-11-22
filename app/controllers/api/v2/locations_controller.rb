module Api::V2
  class LocationsController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, Location
      @total = Location.count
      @locations = Location.paginate(pagination)
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

    def location_params
      params.require(:data).permit(:id, :location_code, :admin_level, :type, :hierarchy, placename: {} )
    end

  end
end