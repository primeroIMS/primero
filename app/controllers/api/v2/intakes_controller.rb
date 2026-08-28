# frozen_string_literal: true

# Main API controller for Intake records
class Api::V2::IntakesController < ApplicationApiController
  include Api::V2::Concerns::Record

  before_action :verify_captcha

  skip_before_action :authenticate_user!, only: %i[create]
  skip_forgery_protection only: %i[create]

  def create
    raise ActiveRecord::RecordNotFound unless @registration_stream.present?

    @record = model_class.new_with_user(authorized_user, create_params)
    @record.save!
    permit_readable_fields
    select_updated_fields
    render 'api/v2/records/create', status: 200
  end

  private

  def verify_captcha
    CaptchaService.verify(provider: Primero::Application.config.x.captcha_provider,
                          token: params[:data][:captcha_token],
                          remote_ip: request.remote_ip)
  end

  def create_params
    record_params.merge(
      status: Record::STATUS_IDENTIFIED,
      record_type: @registration_stream&.record_type,
      module_id: @registration_stream&.module_id
    )
  end

  def instantiate_app_services
    find_registration_stream
    super
  end

  def find_registration_stream
    @registration_stream = SystemSettings.find_registration_stream_by_id(params[:id])
  end

  def model_class
    @model_class ||= PrimeroModelService.to_model(@registration_stream&.record_type)
  end

  def module_unique_id
    @registration_stream&.module_id
  end

  def authorized_user
    @registration_stream&.default_record_owner
  end
end
