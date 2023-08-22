# frozen_string_literal: true

# Main API controller for Case records
class Api::V2::ChildrenController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  def traces
    authorize! :read, Child
    record = Child.includes(:matched_traces).find(params[:case_id])
    authorize! :read, record
    @traces = record.matched_traces
    render 'api/v2/traces/index'
  end

  alias select_updated_fields_super select_updated_fields
  def select_updated_fields
    changes = @record.saved_changes_to_record.keys
    @updated_field_names = select_updated_fields_super + @record.current_care_arrangements_changes(changes)
    @updated_field_names << 'family_details_section' if @record.family&.family_members_changed?
  end

  def create_for_family
    authorize! :create, Child
    @current_record = Child.find(create_for_family_params[:case_id])
    @record = FamilyLinkageService.create_family_linked_child(
      current_user, @current_record, create_for_family_params[:family_detail_id]
    )
    select_updated_fields
  end

  def create_for_family_params
    return @create_for_family_params if @create_for_family_params.present?

    data = params.require(:data).permit(:family_detail_id).to_h
    @create_for_family_params = data.merge(case_id: params.require(:case_id))
  end
end
