class MatchingConfigurationsController < ApplicationController

  before_action :load_matching_configuration, :only => [:edit]

  def edit
    authorize! :update, MatchingConfiguration
  end

  def update
    authorize! :update, MatchingConfiguration
    #TODO
  end

  private

  def load_matching_configuration
    @matching_configuration = MatchingConfiguration.find(params[:id])
  end
end