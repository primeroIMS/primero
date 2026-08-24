# frozen_string_literal: true

# Main API controller for Intake form sections.
class Api::V2::IntakeFormSectionsController < ApplicationApiController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :write_audit_log, only: [:index]

  def index
    @form_sections = SystemSettings.registration_stream_forms(params[:id])
  end
end
