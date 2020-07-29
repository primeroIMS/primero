class AddDisplayConditionsToFields < ActiveRecord::Migration[5.2]
  def change
    if column_exists?(:fields, :searchable_select)
      remove_column :fields, :searchable_select, :string
    end
    if column_exists?(:fields, :subform_sort_by)
      remove_column :fields, :subform_sort_by, :string
    end
    if column_exists?(:fields, :subform_group_by)
      remove_column :fields, :subform_group_by, :string
    end
    # remove subform_sort_by, subform_group_by if exists
    # add then as hash accessor that goes to the subform_section_configuration json
    add_column :fields, :subform_section_configuration, :jsonb
  end
end
