# frozen_string_literal: true

module Api::V2
  class PrimeroModulesController < ApplicationApiController
    before_action :load_primero_module, only: %i[show update]

    def index
      authorize! :index, PrimeroModule
      @primero_modules = PrimeroModule.all
    end

    def show
      authorize! :read, @primero_module
    end

    def update
      authorize! :update, @primero_module
      @primero_module.update_with_properties(modules_params)
      @primero_module.save!
    end

    def modules_params
      params.require(:data).permit(:description, associated_record_types: [], form_section_unique_ids: [])
    end

    protected

    def load_primero_module
      @primero_module = PrimeroModule.find(record_id)
    end
  end
end
