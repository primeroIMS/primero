# frozen_string_literal: true

# Forms CRUD API.
class Api::V2::FormSectionsController < ApplicationApiController
  include Api::V2::Concerns::Export
  include Api::V2::Concerns::JsonValidateParams

  before_action :form_section_params, only: %i[create update]

  def index
    authorize! :index, FormSection
    @form_sections = FormSection.list(params)
  end

  def show
    authorize! :read, FormSection
    @form_section = FormSection.find(params[:id])
  end

  def create
    authorize!(:create, FormSection) && validate_json!(FormSection::FORM_SECTION_FIELDS_SCHEMA, form_section_params)
    @form_section = FormSection.new_with_properties(form_section_params, user: current_user)
    @form_section.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize!(:update, FormSection) && validate_json!(FormSection::FORM_SECTION_FIELDS_SCHEMA, form_section_params)
    @form_section = FormSection.find(params[:id])
    @form_section.update_properties(form_section_params)
    @form_section.save!
  end

  def destroy
    authorize! :enable_disable_record, FormSection
    @form_section = FormSection.find(params[:id])
    @form_section.permitted_destroy!
    @form_section.destroy!
  end

  protected

  def form_section_params
    nested_props = [{ fields: [Field.permitted_api_params] }, { module_ids: [] }]
    @form_section_params ||= params.require(:data).permit(FormSection.permitted_api_params + nested_props)
  end

  def model_class
    FormSection
  end

  def exporter
    return Exporters::FormExporter if params[:export_type] == 'xlsx'
  end
end
