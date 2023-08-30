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

  def family
    authorize! :create, Child
    @current_record = Child.find(family_params[:case_id])
    @record = FamilyLinkageService.new_family_linked_child(
      current_user, @current_record, family_params[:family_detail_id]
    )
    @current_record.save! if @current_record.has_changes_to_save?
    @record.save!

    select_updated_fields
    select_fields_for_show
  end

  def family_params
    return @family_params if @family_params.present?

    data = params.require(:data).permit(:family_detail_id).to_h
    @family_params = data.merge(case_id: params.require(:case_id))
  end
end
