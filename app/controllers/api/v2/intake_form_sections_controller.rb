# frozen_string_literal: true

# Main API controller for Intake form sections.
class Api::V2::IntakeFormSectionsController < ApplicationApiController
  skip_before_action :authenticate_user!, only: %i[index]

  def index
    @form_sections = SystemSettings.registration_stream_forms(params[:id])
    render 'api/v2/form_sections/index', status: 200
  end

  private

  def model_class
    FormSection
  end
end
