class MatchingConfigurationsController < ApplicationController

  before_action :load_form_fields, :only => [:edit]

  def edit
    authorize! :update, MatchingConfiguration
  end

  def update
    authorize! :update, MatchingConfiguration
    #TODO
  end

  private

  def load_form_fields
    #TODO
    @primero_module = PrimeroModule.get(PrimeroModule::CP)
    @case_fields = load_form_fields_by_type('case')
    @tracing_request_fields = load_form_fields_by_type('tracing_request')
  end

  def load_form_fields_by_type(parent_form)
    #DO for all
    form_sections = FormSection.get_permitted_form_sections(@primero_module, parent_form, @current_user)
    form_sections&.map{|f| [f.unique_id, f.description, f.fields.select{|fd| fd.visible == true}&.map{|fd| [fd.name, fd.display_name]}]}
  end
end