# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Synchronize the associated records for a user
class AssociatedRecordsService < ValueObject
  attr_accessor :user, :update_user_groups, :update_agencies, :update_locations, :update_agency_offices, :models

  def update_associated_records
    user_group_unique_ids(true)
    models.each { |model| update_associated_records_for_model(model) }
  end

  def update_associated_records_for_model(model)
    associated_records_for_update(model).find_in_batches(batch_size: 500) do |records|
      records_to_update = []
      records.each do |record|
        update_record_fields(record)
        records_to_update << record if record.changed?
      end
      ActiveRecord::Base.transaction { records_to_update.each(&:save!) }
    end
  end

  def update_record_fields(record)
    update_record_ownership_fields(record)
    record.update_associated_user_groups if update_user_groups
    record.update_associated_user_agencies if update_agencies
  end

  def associated_records_for_update(model)
    if update_user_groups || update_agencies
      model.associated_with(user.user_name)
    else
      model.owned_by(user.user_name)
    end
  end

  def update_record_ownership_fields(record)
    return unless record.owned_by == user.user_name

    record.owned_by_location = user.location if update_locations
    record.owned_by_groups = user_group_unique_ids if update_user_groups
    update_record_agency_ownership_fields(record)
  end

  def user_group_unique_ids(reload = false)
    return @user_group_unique_ids if @user_group_unique_ids.present? && !reload

    @user_group_unique_ids = user.user_group_unique_ids
    @user_group_unique_ids
  end

  def update_record_agency_ownership_fields(record)
    record.owned_by_agency_id = user.agency&.unique_id if update_agencies
    record.owned_by_agency_office = user.agency_office if update_agency_offices
  end
end
