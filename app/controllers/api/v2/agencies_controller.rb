# frozen_string_literal: true

module Api::V2
  class AgenciesController < ApplicationApiController
    include Concerns::Pagination
    before_action :load_agency, only: %i[show update destroy]

    def index
      authorize! :index, Agency
      @total = Agency.all.size
      @agencies = Agency.paginate(pagination)
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
      params.require(:data).permit(:id, :unique_id, :agency_code, :order, :telephone, :logo_enabled,
                                   :disabled, services: [], name: {}, description: {})
    end

    protected

    def load_agency
      @agency = Agency.find(record_id)
    end
  end
end
