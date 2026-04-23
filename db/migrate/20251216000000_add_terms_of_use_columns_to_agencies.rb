# frozen_string_literal: true

class AddTermsOfUseColumnsToAgencies < ActiveRecord::Migration[6.1]
  def change
    add_column :agencies, :terms_of_use_signed, :boolean, default: false, null: false
    add_column :agencies, :terms_of_use_uploaded_at, :datetime
    add_column :agencies, :terms_of_use_uploaded_by, :string
  end
end
