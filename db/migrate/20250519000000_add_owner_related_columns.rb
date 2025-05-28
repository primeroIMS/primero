# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# TODO: This migration should be part of 20250421000000_add_record_filterable_columns.rb
class AddOwnerRelatedColumns < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :srch_assigned_user_names, :string, array: true, default: []

    add_column :incidents, :srch_assigned_user_names, :string, array: true, default: []

    add_column :tracing_requests, :srch_owned_by, :string
    add_column :tracing_requests, :srch_owned_by_agency_id, :string
    add_column :tracing_requests, :srch_assigned_user_names, :string, array: true, default: []

    add_column :families, :srch_owned_by, :string
    add_column :families, :srch_owned_by_agency_id, :string
    add_column :families, :srch_assigned_user_names, :string, array: true, default: []

    add_column :registry_records, :srch_owned_by, :string
    add_column :registry_records, :srch_owned_by_agency_id, :string
    add_column :registry_records, :srch_assigned_user_names, :string, array: true, default: []
  end
end
