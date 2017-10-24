module FormCustomization
  extend ActiveSupport::Concern

  included do
    before_filter :parent_form, :only => [:new, :edit, :published, :update]
    before_filter :current_modules, :only => [:index, :new, :edit, :create, :update]
    before_filter :get_form_group_names, :only => [:new, :edit, :update]
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

  def get_form_group_names
    @list_form_group_names = FormSection.list_form_group_names(@primero_module, parent_form, current_user)
  end
end
