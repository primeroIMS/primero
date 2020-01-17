module Api::V2
  class PrimeroModulesController < ApplicationApiController
    include Concerns::Pagination
    before_action :load_primero_module, only: %i[show update destroy]

    def index
      # TODO: verify this permission
      authorize! :index, PrimeroModule
      @total = PrimeroModule.all.size
      @primero_modules = PrimeroModule.paginate(pagination)
    end

    def show
      authorize! :index, PrimeroModule
    end

    def update
      authorize! :index, PrimeroModule
      @primero_module.update_with_properties(modules_params)
      @primero_module.save!
    end

    def destroy
      authorize! :index, PrimeroModule
      @primero_module.destroy!
    end

    def modules_params
      params.require(:data).permit(:id, :unique_id, :name, :description,
                                   :core_resource, :primero_program,
                                   'associated_record_types' => [], 'field_map' => {},
                                   'form_sections' => [], 'module_options' => {})
    end

    protected

    def load_primero_module
      @primero_module = PrimeroModule.find(record_id)
    end
  end
end
