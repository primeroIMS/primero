# frozen_string_literal: true

# Unprotected API endpoint for public system info
class Api::V2::ContactInformationController < ApplicationApiController
  skip_before_action :authenticate_user!, only: [:show]
  skip_after_action :write_audit_log, only: [:show]
  before_action :load_contact_information, only: %i[show update]

  def show
    @system_settings = SystemSettings.current
    @agencies_with_logos = Agency.with_logos.limit(3)
  end

  def update
    authorize! :update, ContactInformation
    @contact_information.assign_attributes(contact_information_params)
  end

  def contact_information_params
    params.require(:data).permit(ContactInformation.attribute_names)
  end

  protected

  def load_contact_information
    @contact_information = ContactInformation.current
  end
end
