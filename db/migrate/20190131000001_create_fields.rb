class CreateFields < ActiveRecord::Migration[5.0]
  def change
    create_table :fields do |t|
      t.string 'name'
      t.string 'type'
      t.boolean 'multi_select', null: false, default: false
      t.belongs_to :form_section, index: true
      t.boolean 'visible', null: false, default: true
      t.boolean 'mobile_visible', null: false, default: true
      t.boolean 'hide_on_view_page', null: false, default: false
      t.boolean 'show_on_minify_form', null: false, default: false
      t.boolean 'editable', null: false, default: true
      t.boolean 'disabled', null: false, default: false
      t.jsonb 'display_name_i18n'
      t.jsonb 'help_text_i18n'
      t.jsonb 'guiding_questions_i18n'
      t.jsonb 'tally_i18n'
      t.jsonb 'tick_box_label_i18n'
      t.jsonb 'option_strings_text_i18n'
      t.string 'option_strings_source'
      t.integer 'order'
      t.boolean 'hidden_text_field', null: false, default: false
      t.integer 'subform_section_id'
      t.integer 'collapsed_field_for_subform_section_id'
      t.boolean 'autosum_total', null: false, default: false
      t.string 'autosum_group'
      t.string 'selected_value'
      t.text 'link_to_path'  #Used to handle a text field as a link on the show pages
      t.boolean 'link_to_path_external', null: false, default: true #TODO: Delete after UIUX refactor
      t.string 'field_tags', array: true, default: [] #TODO: Maybe not needed after UIUX refactor
      t.boolean 'searchable_select', null: false, default: false #TODO: Delete after UIUX refactor
      t.string 'custom_template' #TODO: Maybe not needed after UIUX refactor
      t.boolean 'expose_unique_id', null: false, default: false
      t.string 'subform_sort_by'
      t.string 'subform_group_by'
      t.boolean 'required', null: false, default: false
      t.string 'date_validation', :default => 'default_date_validation'
      t.boolean 'date_include_time', null: false, default: false
      t.boolean 'matchable', null: false, default: false
    end
    add_foreign_key :fields, :form_sections, column: 'subform_section_id'
    add_index :fields, :name
    add_index :fields, :type
  end
end
