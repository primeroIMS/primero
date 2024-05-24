# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Configuration API to create and apply Primero configuration states
class Api::V2::PrimeroConfigurationsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::JsonValidateParams

  SHOW_ATTRIBUTES = %i[
    id name description version created_on created_by applied_on applied_by primero_version
  ].freeze

  before_action { authorize! :manage, PrimeroConfiguration }

  def index
    @configurations = PrimeroConfiguration.list(order_by:, order:).paginate(pagination).select(*SHOW_ATTRIBUTES)
    @total = @configurations.total_entries
  end

  def show
    @configuration = PrimeroConfiguration.select(*SHOW_ATTRIBUTES).find(params[:id])
  end

  def create
    validate_json!(PrimeroConfiguration::PRIMERO_CONFIGURATION_FIELDS_SCHEMA, configuration_params)
    @configuration = configuration_params[:data].present? ? new_configuration : current_configuration
    @configuration.attributes = configuration_params
    @configuration.save!
  end

  def update
    validate_json!(PrimeroConfiguration::PRIMERO_CONFIGURATION_FIELDS_SCHEMA, configuration_params)
    @configuration = PrimeroConfiguration.find(params[:id])
    @configuration.apply_later!(current_user) if configuration_params[:apply_now].present?
    @configuration.promote_later! if configuration_params[:promote].present?
  end

  def destroy
    @configuration = PrimeroConfiguration.find(params[:id])
    @configuration.destroy!
  end

  def model_class
    PrimeroConfiguration
  end

  def default_sort_field
    'created_on'
  end

  protected

  def configuration_params
    @configuration_params ||= params.require(:data)
                                    .permit(
                                      %i[id name description version apply_now promote primero_version] + [data: {}]
                                    )
  end

  def new_configuration
    PrimeroConfiguration.new_with_user(current_user)
  end

  def current_configuration
    PrimeroConfiguration.current(current_user)
  end
end
