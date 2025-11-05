# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Self Registration API for self registration of users
class Api::V2::SelfRegisterController < Api::V2::RecordResourceController
  skip_before_action :authenticate_user!, only: [:create]
  skip_before_action :find_record, only: [:create]
  before_action :verify_self_registration_allowed

  # Create a new user via self registration
  def create
    @user = User.create_self_registration_user(self_register_params)
    return unless @user.save!

    render json: {}, status: :created
  end

  private

  def verify_self_registration_allowed
    raise Errors::ForbiddenOperation unless Primero::Application.config.allow_self_registration

    CaptchaService.verify(provider: Primero::Application.config.x.captcha_provider,
                          token: params[:user][:captcha_token],
                          remote_ip: request.remote_ip)

    EmailVerificationService.check_email(params[:user][:email])
  end

  def self_register_params
    params.require(:user)
          .permit(:full_name, :email, :locale, :registration_stream,
                  :data_processing_consent_provided, :send_mail, :captcha_token)
          .except(:captcha_token)
  end
end
