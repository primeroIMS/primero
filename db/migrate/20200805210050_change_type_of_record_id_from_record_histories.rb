# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class ChangeTypeOfRecordIdFromRecordHistories < ActiveRecord::Migration[5.2]
  def change
    change_column :record_histories, :record_id, :string
  end
end
