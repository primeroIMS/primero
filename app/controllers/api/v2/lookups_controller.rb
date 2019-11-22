module Api::V2
  class LookupsController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, Lookup
      @total = Lookup.all.size
      @lookups = Lookup.paginate(pagination)
    end

    def show
      authorize! :show, Lookup
      @lookup = Lookup.find(params[:id])
    end

    def create
      authorize! :create, Lookup
      @lookup = Lookup.new_with_properties(lookup_params)
      @lookup.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :update, Lookup
      @lookup = Lookup.find(params[:id])
      @lookup.update_properties(lookup_params)
      @lookup.save!
      render 'show'
    end

    def destroy
      authorize! :enable_disable_record, Lookup
      @lookup = Lookup.find(params[:id])
      @lookup.destroy!
    end

    def lookup_params
      params.require(:data).permit(:id, :unique_id, { name: {} }, { values: {} })
    end

  end
end
