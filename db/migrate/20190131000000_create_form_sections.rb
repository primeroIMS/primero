class CreateFormSections < ActiveRecord::Migration[5.0]
  def change

    create_table :form_sections do |t|
      t.string 'unique_id'
      t.jsonb 'name_i18n'
      t.jsonb 'help_text_i18n'
      t.jsonb 'description_i18n'
      t.string 'parent_form'
      t.boolean 'visible', null: false, default: true
      t.integer 'order'
      t.integer 'order_form_group'
      t.integer 'order_subform' #TODO: Is this even used? Refactor with UIUX
      t.boolean 'form_group_keyed', null: false, default: false
      t.string 'form_group_id' #TODO: this is probably not a string
      t.boolean 'editable', null: false, default: true
      t.boolean 'core_form', null: false, default: false
      t.boolean 'is_nested', null: false, default: false
      t.boolean 'is_first_tab', null: false, default: false
      t.integer 'initial_subforms'
      t.boolean 'subform_prevent_item_removal', null: false, default: false
      t.boolean 'subform_append_only', null: false, default: false
      t.string 'subform_header_links', array: true, default: [] #TODO: Refactor or utilize when revamiping UIUX
      t.boolean 'display_help_text_view', null: false, default: false
      t.string 'shared_subform'
      t.string 'shared_subform_group'
      t.boolean 'is_summary_section', null: false, default: false
      t.boolean 'hide_subform_placeholder', null: false, default: false
      t.boolean 'mobile_form', null: false, default: false
      t.text 'header_message_link'
    end
    add_index :form_sections, :unique_id, unique: true

  end
end
