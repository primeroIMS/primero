# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoint for case relationships
class Api::V2::CaseRelationshipsController < Api::V2::RecordResourceController
  before_action :selected_field_names

  def index
    authorize! :view_case_relationships, @record
    @case_relationships = CaseRelationship.list(@record.id, params[:relationship_type])
    render 'api/v2/case_relationships/index'
  end

  def create
    authorize! :update_case_relationships, @record
    @case_relationship = CaseRelationship.new_case_relationship(primary_case_id: @record.id,
                                                                related_case_id: permitted_params[:case_id],
                                                                relationship_type: permitted_params[:relationship_type])
    @case_relationship.save!
    updates_for_record(@record)
    render 'api/v2/case_relationships/create'
  end

  def update
    authorize! :update_case_relationships, @record
    @case_relationship = CaseRelationship.find(params[:id])
    @case_relationship.update({ primary: permitted_params[:primary], disabled: permitted_params[:disabled] }.compact)
    updates_for_record(@record)
    render 'api/v2/case_relationships/update'
  end

  def destroy
    authorize! :update_case_relationships, @record
    @case_relationship = CaseRelationship.find(params[:id])
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
end
