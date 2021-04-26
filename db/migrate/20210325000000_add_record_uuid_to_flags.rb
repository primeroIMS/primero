# frozen_string_literal: true

class AddRecordUuidToFlags < ActiveRecord::Migration[5.2]
  def change
    add_column :flags, :record_uuid, :uuid
  end
end
