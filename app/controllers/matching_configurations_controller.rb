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
    params[:matching_configuration][:case_fields].present? ? params[:matching_configuration][:case_fields].reject!(&:blank?) : []
  end

  def tracing_request_fields
    params[:matching_configuration][:tracing_request_fields].present? ? params[:matching_configuration][:tracing_request_fields].reject!(&:blank?) : []
  end
end