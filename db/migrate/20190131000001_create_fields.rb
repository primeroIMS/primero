class CreateFields < ActiveRecord::Migration[5.0]
  def change
    create_table :fields do |t|
      t.string 'name'
      t.string 'type'
      t.boolean 'multi_select', null: false, default: false
      t.boolean 'visible', null: false, default: false
      t.boolean 'mobile_visible', null: false, default: false
      t.boolean 'hide_on_view_page', null: false, default: false
      t.boolean 'show_on_minify_form', null: false, default: false
      t.boolean 'editable', null: false, default: false
      t.boolean 'disabled', null: false, default: false
      t.text 'display_name_i18n'
      t.text 'help_text_i18n'
      t.text 'guiding_questions_i18n'
      t.text 'tally_i18n'
      t.text 'tick_box_label_i18n'
      #TODO: option_strings_text?
      t.boolean 'hidden_text_field'
      t.string 'base_language'
      t.integer
      t.boolean
      t.boolean
      t.boolean
      t.boolean
      t.boolean
      t.boolean
      t.boolean
      t.boolean





    end
  end
end
