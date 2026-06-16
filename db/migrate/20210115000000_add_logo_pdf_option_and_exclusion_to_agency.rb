# frozen_string_literal: true

class AddLogoPdfOptionAndExclusionToAgency < ActiveRecord::Migration[5.2]
  def change
    add_column :agencies, :pdf_logo_option, :boolean, null: false, default: false
    add_column :agencies, :exclude_agency_from_lookups, :boolean, null: false, default: false
  end
end
