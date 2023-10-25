# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddRecordUuidToFlags < ActiveRecord::Migration[5.2]
  def change
    add_column :flags, :record_uuid, :uuid
  end
end
