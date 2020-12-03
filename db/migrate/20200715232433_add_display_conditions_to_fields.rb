# frozen_string_literal: true

class AddDisplayConditionsToFields < ActiveRecord::Migration[5.2]
  def change
    # remove subform_sort_by, subform_group_by if exists
    # add then as hash accessor that goes to the subform_section_configuration json
    remove_column :fields, :searchable_select, :string if column_exists?(:fields, :searchable_select)
    remove_column :fields, :subform_sort_by, :string if column_exists?(:fields, :subform_sort_by)
    remove_column :fields, :subform_group_by, :string if column_exists?(:fields, :subform_group_by)
    add_column :fields, :subform_section_configuration, :jsonb
  end
end
