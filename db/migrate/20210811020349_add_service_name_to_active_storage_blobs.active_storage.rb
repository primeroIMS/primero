# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This migration comes from active_storage (originally 20190112182829)
class AddServiceNameToActiveStorageBlobs < ActiveRecord::Migration[6.0]
  def up
    return if column_exists?(:active_storage_blobs, :service_name)

    add_column :active_storage_blobs, :service_name, :string

    configured_service = ActiveStorage::Blob.service.name
    configured_service && ActiveStorage::Blob.unscoped.update_all(service_name: configured_service)
    change_column :active_storage_blobs, :service_name, :string, null: false
  end

  def down
    remove_column :active_storage_blobs, :service_name
  end
end
