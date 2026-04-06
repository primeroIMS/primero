# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
class AddIdentifierTypeToSearchableIdentifiers < ActiveRecord::Migration[8.1]
  def change
    add_column :searchable_identifiers, :identifier_type, :string
    add_index :searchable_identifiers, %i[identifier_type value]
  end
end
