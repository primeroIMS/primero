# frozen_string_literal: true

class ChangeTypeOfRecordIdFromRecordHistories < ActiveRecord::Migration[5.2]
  def change
    change_column :record_histories, :record_id, :string
  end
end
