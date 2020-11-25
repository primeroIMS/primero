# frozen_string_literal: true

# Unprotected API endpoint for public system info
class Api::V2::ContactInformationController < ApplicationApiController
  before_action :load_contact_information, only: %i[show update]
  skip_after_action :write_audit_log, only: [:show]

  def show
    @system_settings = SystemSettings.current
  end

  def update
    authorize! :update, ContactInformation
    @contact_information.assign_attributes(contact_information_params)
    @contact_information.save!
  end

  def contact_information_params
    params.require(:data).permit(ContactInformation.attribute_names)
  end

  protected

  def load_contact_information
    @contact_information = ContactInformation.current
  end
end
