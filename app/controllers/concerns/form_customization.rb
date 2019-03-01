module FormCustomization
  extend ActiveSupport::Concern

  included do
    before_action :parent_form, :only => [:new, :create, :edit, :update, :destroy]
    before_action :current_modules, :only => [:index, :new, :edit, :create, :update]
    before_action :get_form_groups, :only => [:new, :edit, :update]
  end

  private

  def parent_form
    @parent_form ||= params[:parent_form] || 'case'
  end

  def current_modules
    @current_modules ||= current_user.modules #TODO: This is a memoized call and may get us in trouble.
    @module_id = params[:module_id] || @current_modules.first.id
    @primero_module = @current_modules.select{|m| m.id == @module_id}.first
  end

  def get_form_groups
    module_name = @primero_module.try(:name)
    @list_form_groups = if parent_form.present? && module_name.present? 
                          Lookup.values_for_select("lookup-form-group-#{module_name.downcase}-#{parent_form}")
                        else
                          []
                        end
  end
end
