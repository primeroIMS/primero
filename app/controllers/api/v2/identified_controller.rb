# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# API for identified case records
class Api::V2::IdentifiedController < ApplicationApiController
  include Api::V2::Concerns::Record

  before_action :authorize_identified!, only: %i[show create update]

  def create
    authorize_create!
    validate_record_unique!
    validate_json!
    @record = model_class.new_with_user(current_user, record_params)
    @record.mark_identified(current_user)
    @record.save!
    permit_readable_fields
    select_updated_fields
    status = params.dig(:data, :id).present? ? 204 : 200
    render 'api/v2/records/create', status:
  end

  def validate_record_unique!
    find_record
    raise ActiveRecord::RecordNotUnique
  rescue ActiveRecord::RecordNotFound
    # Only when an identified record is not found, a new one can be created.
  end

  def find_record
    @record = model_class.find_by!(
      SearchFilters::TextValue.new(
        field_name: 'identified_by', value: current_user.user_name
      ).query(model_class)
    )
  end

  def authorize_identified!
    raise CanCan::AccessDenied unless current_user.group_permission?(Permission::IDENTIFIED)
  end
end
