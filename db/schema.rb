# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190311000001) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "agencies", id: :serial, force: :cascade do |t|
    t.string "agency_code", null: false
    t.integer "order", default: 0
    t.jsonb "name_i18n"
    t.jsonb "description_i18n"
    t.string "telephone"
    t.string "services", default: [], array: true
    t.boolean "logo_enabled", default: false, null: false
    t.boolean "disabled", default: false, null: false
    t.index ["agency_code"], name: "index_agencies_on_agency_code", unique: true
    t.index ["services"], name: "index_agencies_on_services", using: :gin
  end

  create_table "audit_logs", id: :serial, force: :cascade do |t|
    t.string "user_name"
    t.string "action_name"
    t.integer "display_id"
    t.string "record_type"
    t.integer "record_id"
    t.string "owned_by"
    t.datetime "timestamp"
    t.jsonb "mobile_data"
    t.index ["record_type", "record_id"], name: "index_audit_logs_on_record_type_and_record_id"
    t.index ["user_name"], name: "index_audit_logs_on_user_name"
  end

  create_table "contact_informations", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "organization"
    t.string "phone"
    t.string "location"
    t.text "other_information"
    t.string "support_forum"
    t.string "email"
    t.string "position"
  end

  create_table "export_configurations", id: :serial, force: :cascade do |t|
    t.string "unique_id"
    t.string "export_id"
    t.jsonb "name_i18n"
    t.string "property_keys", default: [], array: true
    t.string "record_type", default: "Child"
    t.string "opt_out_field"
    t.string "property_keys_opt_out", default: [], array: true
    t.index ["unique_id"], name: "index_export_configurations_on_unique_id", unique: true
  end

  create_table "fields", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "type"
    t.boolean "multi_select", default: false, null: false
    t.integer "form_section_id"
    t.boolean "visible", default: true, null: false
    t.boolean "mobile_visible", default: true, null: false
    t.boolean "hide_on_view_page", default: false, null: false
    t.boolean "show_on_minify_form", default: false, null: false
    t.boolean "editable", default: true, null: false
    t.boolean "disabled", default: false, null: false
    t.jsonb "display_name_i18n"
    t.jsonb "help_text_i18n"
    t.jsonb "guiding_questions_i18n"
    t.jsonb "tally_i18n"
    t.jsonb "tick_box_label_i18n"
    t.jsonb "option_strings_text_i18n"
    t.string "option_strings_source"
    t.integer "order"
    t.boolean "hidden_text_field", default: false, null: false
    t.integer "subform_section_id"
    t.integer "collapsed_field_for_subform_section_id"
    t.boolean "autosum_total", default: false, null: false
    t.string "autosum_group"
    t.string "selected_value"
    t.text "link_to_path"
    t.boolean "link_to_path_external", default: true, null: false
    t.string "field_tags", default: [], array: true
    t.boolean "searchable_select", default: false, null: false
    t.string "custom_template"
    t.boolean "expose_unique_id", default: false, null: false
    t.string "subform_sort_by"
    t.string "subform_group_by"
    t.boolean "required", default: false, null: false
    t.string "date_validation", default: "default_date_validation"
    t.boolean "date_include_time", default: false, null: false
    t.boolean "matchable", default: false, null: false
    t.index ["form_section_id"], name: "index_fields_on_form_section_id"
  end

  create_table "form_sections", id: :serial, force: :cascade do |t|
    t.string "unique_id"
    t.jsonb "name_i18n"
    t.jsonb "help_text_i18n"
    t.jsonb "description_i18n"
    t.string "parent_form"
    t.boolean "visible", default: true, null: false
    t.integer "order"
    t.integer "order_form_group"
    t.integer "order_subform"
    t.boolean "form_group_keyed", default: false, null: false
    t.string "form_group_id"
    t.boolean "editable", default: true, null: false
    t.boolean "core_form", default: false, null: false
    t.boolean "is_nested", default: false, null: false
    t.boolean "is_first_tab", default: false, null: false
    t.integer "initial_subforms"
    t.boolean "subform_prevent_item_removal", default: false, null: false
    t.boolean "subform_append_only", default: false, null: false
    t.string "subform_header_links", default: [], array: true
    t.boolean "display_help_text_view", default: false, null: false
    t.string "shared_subform"
    t.string "shared_subform_group"
    t.boolean "is_summary_section", default: false, null: false
    t.boolean "hide_subform_placeholder", default: false, null: false
    t.boolean "mobile_form", default: false, null: false
    t.text "header_message_link"
    t.index ["unique_id"], name: "index_form_sections_on_unique_id", unique: true
  end

  create_table "reports", id: :serial, force: :cascade do |t|
    t.jsonb "name_i18n"
    t.jsonb "description_i18n"
    t.string "module_id"
    t.string "record_type"
    t.string "aggregate_by", default: [], array: true
    t.string "disaggregate_by", default: [], array: true
    t.string "aggregate_counts_from"
    t.jsonb "filters", default: [], array: true
    t.boolean "group_ages", default: false, null: false
    t.string "group_dates_by", default: "date"
    t.boolean "is_graph", default: false, null: false
    t.boolean "editable", default: true
  end

  create_table "saved_searches", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "module_id"
    t.string "record_type"
    t.string "user_name"
    t.jsonb "filters"
  end

  create_table "user_groups", id: :serial, force: :cascade do |t|
    t.string "unique_id"
    t.string "name"
    t.string "description"
    t.boolean "core_resource", default: false, null: false
    t.index ["unique_id"], name: "index_user_groups_on_unique_id", unique: true
  end

end
