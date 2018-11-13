class MatchingConfigurationsController < ApplicationController
  #TODO - Create rspec tests

  before_action :load_matching_configuration, :only => [:show, :edit]

  def show
    authorize! :show, MatchingConfiguration
  end

  def edit
    authorize! :update, MatchingConfiguration
  end

  def update
    authorize! :update, MatchingConfiguration
    begin
      matching_configuration = MatchingConfiguration.new
      matching_configuration.case_fields = case_fields
      matching_configuration.tracing_request_fields = tracing_request_fields
      matching_configuration.case_forms = case_forms
      matching_configuration.tracing_request_forms = tracing_request_forms

      matching_configuration.update_matchable_fields

      flash[:notice] = t("matching_configuration.updated")
      redirect_to matching_configuration_path
    rescue => error
      logger.error "Error updating matchable configuration"
      logger.error error.message
      logger.error error.backtrace
      flash[:notice] = t("matching_configuration.update_error")
      redirect_back(fallback_location: root_path)
    end
  end

  private

  def load_matching_configuration
    @matching_configuration = MatchingConfiguration.find(params[:id])
  end

  def case_fields
    return [] unless params[:matching_configuration][:case_fields].present?
    filter_form_fields(params[:matching_configuration][:case_fields])
  end

  def tracing_request_fields
    return [] unless params[:matching_configuration][:tracing_request_fields].present?
    filter_form_fields(params[:matching_configuration][:tracing_request_fields])
  end

  def case_forms
    return [] unless params[:matching_configuration][:case_forms].present?
    params[:matching_configuration][:case_forms].reject(&:blank?)
  end

  def tracing_request_forms
    return [] unless params[:matching_configuration][:tracing_request_forms].present?
    params[:matching_configuration][:tracing_request_forms].reject(&:blank?)
  end

  def filter_form_fields(form_fields)
    fields = []
    form_fields.each { |_form_key, form_field| fields << form_field }
    fields.flatten.reject(&:blank?)
  end
end
