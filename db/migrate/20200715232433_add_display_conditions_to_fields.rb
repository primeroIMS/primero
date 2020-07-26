class AddDisplayConditionsToFields < ActiveRecord::Migration[5.2]
  def change
    # remove subform_sort_by, subform_group_by if exists
    # add then as hash accessor that goes to the subform_section_configuration json
    add_column :fields, :subform_section_configuration, :jsonb
  end
end
