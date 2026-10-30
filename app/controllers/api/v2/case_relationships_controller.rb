# frozen_string_literal: true

# API endpoint for case relationships
class Api::V2::CaseRelationshipsController < Api::V2::RecordResourceController
  before_action :selected_field_names

  def index
    authorize! :view_case_relationships, @record
    @case_relationships = CaseRelationship.list(@record.id, params[:relationship_type])
    render 'api/v2/case_relationships/index'
  end

  def create
    authorize_create!
    @case_relationship = CaseRelationship.new_case_relationship(primary_case_id: @record.id,
                                                                related_case_id: permitted_params[:case_id],
                                                                relationship_type: permitted_params[:relationship_type])
    @case_relationship.save!
    updates_for_record(@record)
    render 'api/v2/case_relationships/create'
  end

  def update
    authorize_update!
    @case_relationship.update({ primary: permitted_params[:primary], disabled: permitted_params[:disabled] }.compact)
    updates_for_record(@record)
    render 'api/v2/case_relationships/update'
  end

  def destroy
    authorize_update!
    @case_relationship.update(disabled: true)
    @case_relationship.save!
    render 'api/v2/case_relationships/destroy'
  end

  private

  def permitted_params
    params.require(:data).permit(:case_id, :relationship_type, :primary, :disabled)
  end

  def selected_field_names
    @selected_field_names ||= Child.summary_field_names | Child.preview_field_names | %w[id]
  end

  def authorize_create!
    authorize! :update_case_relationships, @record
    @related_case = Child.find(permitted_params[:case_id])
    authorize_related_case!
  end

  def authorize_update!
    authorize! :update_case_relationships, @record
    @case_relationship = @record.case_relationships.find(params[:id])
    @related_case = @case_relationship.related_case(@record.id)
    authorize_related_case!
  end

  def authorize_related_case!
    authorize! :read, @related_case
  rescue CanCan::AccessDenied
    authorize! :search_owned_by_others, Child
  end
end
