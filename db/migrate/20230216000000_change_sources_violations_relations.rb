# frozen_string_literal: true

class ChangeSourcesViolationsRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :sources_violations do |t|
      t.references :violation, type: :uuid, index: true, foreign_key: true
      t.references :source, type: :uuid, index: true, foreign_key: true
    end
  end
end
