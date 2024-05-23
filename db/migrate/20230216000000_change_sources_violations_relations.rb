# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class ChangeSourcesViolationsRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :sources_violations do |t|
      t.references :violation, type: :uuid, index: true, foreign_key: true
      t.references :source, type: :uuid, index: true, foreign_key: true
    end
  end
end
