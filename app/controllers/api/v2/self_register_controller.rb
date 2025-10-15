# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Self Registration API for self registration of users
class Api::V2::SelfRegisterController < Api::V2::RecordResourceController
  skip_before_action :authenticate_user!, only: [:create]
  skip_before_action :find_record, only: [:create]

  # Create a new user via self registration
  def create
    # TODO: Add recaptcha verification, rate limiting, etc.
    raise Errors::ForbiddenOperation unless Primero::Application.config.allow_self_registration

    @user = User.create_self_registration_user(self_register_params)
    return unless @user.save!

    render json: {}, status: :created
  end

  private

  def self_register_params
    params.require(:user).permit(:full_name, :email, :locale, :user_name, :registration_stream,
                                 :data_processing_consent_provided, :send_mail)
  end
end
