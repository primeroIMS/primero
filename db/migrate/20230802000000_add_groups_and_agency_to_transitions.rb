# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddGroupsAndAgencyToTransitions < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :record_owned_by, :string
    add_column :transitions, :record_owned_by_agency, :string
    add_column :transitions, :record_owned_by_groups, :string, array: true
    add_column :transitions, :transitioned_by_user_agency, :string
    add_column :transitions, :transitioned_by_user_groups, :string, array: true
    add_column :transitions, :transitioned_to_user_agency, :string
    add_column :transitions, :transitioned_to_user_groups, :string, array: true
  end
end
