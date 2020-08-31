# frozen_string_literal: true

# Configuration API to create and apply Primero configuration states
class Api::V2::PrimeroConfigurationsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  before_action { authorize! :manage, PrimeroConfiguration }

  def index
    @configurations = PrimeroConfiguration.all.paginate(pagination)
    @total = @configurations.total_entries
  end

  def show
    @configuration = PrimeroConfiguration.find(params[:id])
  end

  def create
    @configuration = PrimeroConfiguration.current(current_user)
    @configuration.attributes = configuration_params
    @configuration.save!
  end

  def update
    @configuration = PrimeroConfiguration.find(params[:id])
    @configuration.apply!(current_user) if configuration_params[:apply_now].present?
  end

  def destroy
    @configuration = PrimeroConfiguration.find(params[:id])
    @configuration.destroy!
  end

  def model_class
    PrimeroConfiguration
  end

  protected

  def configuration_params
    params.require(:data).permit(%i[name description version apply_now])
  end
end
