class FormSection < CouchRest::Model::Base
  include PrimeroModel
  include LocalizableProperty
  include Importable
  include Memoizable

  RECORD_TYPES = ['case', 'incident', 'tracing_request']
  DEFAULT_BASE_LANGUAGE = Primero::Application::LOCALE_ENGLISH
  #TODO - include Namable - will require a fair amount of refactoring

  use_database :form_section
  localize_properties [:name, :help_text, :description]
  property :unique_id
  property :parent_form
  property :visible, TrueClass, :default => true
  property :order, Integer, :default => 0
  property :order_form_group, Integer, :default => 0
  property :order_subform, Integer, :default => 0
  property :form_group_keyed, TrueClass, :default => false
  property :form_group_id
  property :fields, [Field]
  property :editable, TrueClass, :default => true
  property :fixed_order, TrueClass, :default => false
  property :perm_visible, TrueClass, :default => false
  property :perm_enabled, TrueClass, :default => false
  property :core_form, TrueClass, :default => true
  property :validations, [String]
  property :base_language, :default => DEFAULT_BASE_LANGUAGE
  property :is_nested, TrueClass, :default => false
  property :is_first_tab, TrueClass, :default => false
  property :initial_subforms, Integer, :default => 0
  property :collapsed_fields, [String], :default => []
  property :subform_prevent_item_removal, :default => false
  property :subform_header_links, [String], :default => []
  #Will display a help text on show page if the section is empty.
  property :display_help_text_view, TrueClass, :default => false
  property :shared_subform
  property :shared_subform_group
  property :is_summary_section, TrueClass, :default => false
  property :hide_subform_placeholder, TrueClass, :default => false
  property :mobile_form, TrueClass, :default => false
  property :header_message_link, String, :default => ""

  # If this property is true and user is on a mobile device, users must only be allowed to add subforms.
  property :subform_append_only, TrueClass, :default => false

  attr_accessor :module_name

  design

  design :by_unique_id do
    view :by_unique_id
  end

  design :by_parent_form do
    view :by_parent_form
  end

  design :by_parent_form_and_mobile_form do
    view :by_parent_form_and_mobile_form
  end

  design :by_order do
    view :by_order
  end

  design :by_parent_form_and_unique_id do
    view :by_parent_form_and_unique_id
  end

  design :by_lookup_field do
    view :by_lookup_field,
      :map => "function(doc) {
                if (doc['couchrest-type'] == 'FormSection'){
                  if (doc['fields'] != null){
                    for(var i = 0; i<doc['fields'].length; i++){
                      var field = doc['fields'][i];
                      if (field['option_strings_source'] && field['option_strings_source'].indexOf('lookup') >= 0){
                        emit(field['option_strings_source'].replace('lookup ', '').replace('group ', ''), null);
                      }
                    }
                  }
                }
              }"
  end

  design :fields do
    view :fields,
      :map => "function(doc) {
                if (doc['couchrest-type'] == 'FormSection'){
                  if (doc['fields'] != null){
                    for(var i = 0; i<doc['fields'].length; i++){
                      var field = {};
                      for (var k in doc['fields'][i]) {
                        field[k] = doc['fields'][i][k];
                      }
                      field['on_nested'] = doc['is_nested'];
                      field['parent_form'] = doc['parent_form'];
                      emit(field['name'], field);
                    }
                  }
                }
              }"
  end

  design :having_location_fields_by_parent_form do
    view :having_location_fields_by_parent_form,
         :map => "function(doc) {
                if (doc['couchrest-type'] == 'FormSection'){
                  if (doc['fields'] != null){
                    var loc_fields = false;
                    for(var i = 0; i<doc['fields'].length; i++){
                      var field = doc['fields'][i];
                      if (field['option_strings_source'] && field['option_strings_source'] == 'Location'){
                        loc_fields = true;
                      }
                    }
                    if(loc_fields == true){
                      emit(doc['parent_form'], null);
                    }
                  }
                }
              }"
  end

  validate :validate_name_in_base_language
  validate :validate_name_format
  validate :validate_unique_id
  validate :validate_visible_field
  validate :validate_fixed_order
  validate :validate_perm_visible
  validate :validate_datatypes

  before_validation :generate_options_keys
  before_validation :sync_options_keys
  before_save :sync_form_group
  after_save :recalculate_subform_permissions

  def form_group_name(opts={})
    locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
    return self.send("name_#{locale}") if self.form_group_id.blank?
    Lookup.form_group_name(self.form_group_id, self.parent_form, self.module_name, locale: locale, lookups: opts[:lookups])
  end

  def localized_property_hash(locale=DEFAULT_BASE_LANGUAGE, show_hidden_fields=false)
    lh = localized_hash(locale)
    fldz = {}
    self.fields.each { |f| fldz[f.name] = f.localized_property_hash locale if (show_hidden_fields || f.visible?)}
    lh['fields'] = fldz
    lh
  end

  def inspect
    "FormSection(#{self.name}, form_group_id => '#{self.form_group_id}')"
  end

  def validate_name_in_base_language
    name = "name_#{DEFAULT_BASE_LANGUAGE}"
    unless (self.send(name).present?)
      errors.add(:name, I18n.t("errors.models.form_section.presence_of_name"))
      return false
    end
  end

  def initialize(properties={}, options={})
    self["fields"] = []
    self["shared_subform"] ||= ""
    self["shared_subform_group"] ||= ""
    self["is_summary_section"] ||= false
    self["base_language"] ||= 'en'
    super properties, options
    create_unique_id
  end

  alias to_param unique_id

  class << self

    def memoized_dependencies
      [Field]
    end

    # memoize by_unique_id because some things call this directly
    alias :old_by_unique_id :by_unique_id
    def by_unique_id *args
      old_by_unique_id *args
    end
    memoize_in_prod :by_unique_id

    def get_unique_instance(attributes)
      get_by_unique_id(attributes['unique_id'])
    end
    memoize_in_prod :get_unique_instance

    def enabled_by_order
      by_order.select(&:visible?)
    end
    memoize_in_prod :enabled_by_order

    def all_child_field_names
      all_child_fields.map { |field| field["name"] }
    end
    memoize_in_prod :all_child_field_names

    def all_visible_form_fields(parent_form = 'case', subforms=true)
      find_all_visible_by_parent_form(parent_form, subforms).map do |form_section|
        form_section.fields.find_all(&:visible)
      end.flatten
    end
    memoize_in_prod :all_visible_form_fields

    #Given a list of forms, return their subforms
    def get_subforms(forms)
      subform_ids, result = [], []
      forms.map{|f| f.fields}.flatten.each do |field|
        if field.type == 'subform' && field.subform_section_id
          subform_ids.push field.subform_section_id
        end
      end
      if subform_ids.present?
        result = FormSection.by_unique_id(keys: subform_ids).all
      end
      return result
    end
    memoize_in_prod :get_subforms

    def all_forms_grouped_by_parent(include_subforms=false)
      forms = all.all
      unless include_subforms
        forms = forms.select{|f| !f.is_nested}
      end
      forms.group_by{|f| f.parent_form}
    end
    memoize_in_prod :all_forms_grouped_by_parent

    def all_child_fields
      all.map do |form_section|
        form_section.fields
      end.flatten
    end
    memoize_in_prod :all_child_fields

    def enabled_by_order_without_hidden_fields
      enabled_by_order.each do |form_section|
        form_section['fields'].map! { |field| field if field.visible? }
        form_section['fields'].compact!
      end
    end
    memoize_in_prod :enabled_by_order_without_hidden_fields

    #Create the form section if does not exists.
    #If the form section does exist will attempt
    #to create fields if the fields does not exists.
    def create_or_update_form_section(properties = {})
      unique_id = properties[:unique_id]
      return nil if unique_id.blank?
      form_section = self.get_by_unique_id(unique_id)
      if form_section.present?
        Rails.logger.info {"Updating form section #{unique_id}"}
        form_section.attributes = properties
        form_section.save!
      else
        Rails.logger.info {"Creating form section #{unique_id}"}
        return self.create!(properties)
      end
      form_section
    end
    alias :create_or_update :create_or_update_form_section

    def find_all_visible_by_parent_form(parent_form, subforms=true)
      #by_parent_form(:key => parent_form).select(&:visible?).sort_by{|e| [e.order_form_group, e.order, e.order_subform]}
      find_by_parent_form(parent_form, subforms).select(&:visible?)
    end
    memoize_in_prod :find_all_visible_by_parent_form

    def find_by_parent_form(parent_form, subforms=true)
      #TODO: the sortby can be moved to a couchdb view
      result = by_parent_form(:key => parent_form).sort_by{|e| [e.order_form_group, e.order, e.order_subform]}
      if result.present? && !subforms
        result = filter_subforms(result)
      end
      return result
    end
    memoize_in_prod :find_by_parent_form

    def get_by_unique_id(unique_id)
      by_unique_id(:key => unique_id).first
    end
    memoize_in_prod :get_by_unique_id

    def highlighted_fields
      all.map do |form|
        form.fields.select { |field| field.is_highlighted? }
      end.flatten
    end
    memoize_in_prod :highlighted_fields

    def sorted_highlighted_fields
      highlighted_fields.sort { |field1, field2| field1.highlight_information.order.to_i <=> field2.highlight_information.order.to_i }
    end
    memoize_in_prod :sorted_highlighted_fields

    def violation_forms
      ids = Incident.violation_id_fields.keys
      FormSection.by_unique_id(keys: ids).all
    end
    memoize_in_prod :violation_forms

    #TODO: This needs to be made not hard-coded
    def binary_form_names
      ['Photos and Audio', 'Other Documents', 'BID Records', 'BIA Records']
    end


    #TODO - can this be done more efficiently?
    def find_form_groups_by_parent_form parent_form
      all_forms = self.find_by_parent_form(parent_form)

      form_sections = []
      subforms_hash = {}

      all_forms.each do |form|
        if form.visible?
          form_sections.push form
        else
          subforms_hash[form.unique_id] = form
        end
      end

      #TODO: The map{}.flatten still takes 13 ms to run
      form_sections.map{|f| f.fields}.flatten.each do |field|
        if field.type == 'subform' && field.subform_section_id
          field.subform ||= subforms_hash[field.subform_section_id]
        end
      end

      form_groups = form_sections.group_by{|e| e.form_group_name}
    end
    memoize_in_prod :find_form_groups_by_parent_form


    #Given an arbitrary list of forms go through and link up the forms to subforms.
    #Functionally this isn't important, but this will improve performance if the list
    #contains both the top forms and the subforms by avoiding extra queries.
    #TODO: Potentially this method is expensive
    def link_subforms(forms)
      subforms_hash = forms.reduce({}) do |hash, form|
        hash[form.unique_id] = form if form.is_nested?
        hash
      end

      forms.map{|f| f.fields}.flatten.each do |field|
        if field.type == Field::SUBFORM && field.subform_section_id
          field.subform ||= subforms_hash[field.subform_section_id]
        end
      end

      return forms
    end
    memoize_in_prod :link_subforms

    #Return a hash of subforms, where the keys are the form groupings
    def group_forms(forms, opts={})
      grouped_forms = {}
      sorted_forms = forms.sort_by{|f| [f.order_form_group, f.order]}
      grouped_forms = sorted_forms.group_by{|f| f.form_group_id} if sorted_forms.present?
      return grouped_forms
    end

    def get_visible_form_sections(form_sections)
      visible_forms = []
      visible_forms = form_sections.select{|f| f.visible?} if form_sections.present?

      return visible_forms
    end
    memoize_in_prod :get_visible_form_sections

    def filter_subforms(form_sections)
      forms = []
      forms = form_sections.select{|f| (f.is_nested.blank? || f.is_nested != true)} if form_sections.present?

      return forms
    end
    memoize_in_prod :filter_subforms

    def filter_for_mobile(form_sections)
      forms = []
      forms = form_sections.select{|f| f.mobile_form == true} if form_sections.present?

      return forms
    end

    # Returns: an array of fields that are matchable
    def get_matchable_fields_by_parent_form(parent_form, subform=true)
      form_sections = FormSection.by_parent_form(:key => parent_form).all
      if subform
        form_fields = form_sections.select{|f| (f.is_nested.present? && f.is_nested == true)}.map{|fs| fs.all_matchable_fields}.flatten
      else
        form_fields = filter_subforms(form_sections).map{|fs| fs.all_matchable_fields}.flatten
      end
      form_fields
    end
    memoize_in_prod :get_matchable_fields_by_parent_form

    def get_matchable_form_and_field_by_parent_form(parent_form, sub_form=true)
      #Get the matchable fields from either the regular forms or from the subforms, depending on the value of the sub_form param
      FormSection.by_parent_form(key: parent_form).all
          .select{ |f| sub_form ? f.is_nested.present? : f.is_nested.blank? }
          .each{ |f| f.all_matchable_fields.uniq(&:name).select(&:visible?) }
    end

    def form_sections_by_ids_and_parent_form(form_ids, parent_form)
      form_ids.present? ? FormSection.by_parent_form_and_unique_id(keys: form_ids.map{|f| [parent_form, f]}).all : []
    end

    #Return only those forms that can be accessed by the user given their role permissions and the module
    def get_permitted_form_sections(primero_module, parent_form, user)
      allowed_form_ids = self.get_allowed_form_ids(primero_module, user)
      forms = allowed_form_ids.present? ? FormSection.by_parent_form_and_unique_id(keys: allowed_form_ids.map{|f| [parent_form, f]}).all : []
      forms.each{|f| f.module_name = primero_module.name}
      forms
    end
    memoize_in_prod :get_permitted_form_sections

    #Get the form sections that the  user is permitted to see and intersect them with the forms associated with the module
    def get_allowed_form_ids(primero_module, user)
      user_form_ids = user.permitted_form_ids
      module_form_ids = primero_module.present? ? primero_module.associated_form_ids.select(&:present?) : []
      user_form_ids & module_form_ids
    end

    def get_form_sections_by_module(primero_modules, parent_form, current_user)
      primero_modules.map do |primero_module|
        allowed_visible_forms = get_allowed_visible_forms_sections(primero_module, parent_form, current_user)
        forms = allowed_visible_forms.map{|key, forms_sections| forms_sections}.flatten
        [primero_module.id, forms]
      end.to_h
    end
    memoize_in_prod :get_form_sections_by_module

    #Returns a list of all form sections having a field of the passed in lookup field
    def find_by_lookup_field lookup_field
      by_lookup_field(:key => lookup_field)
    end
    memoize_in_prod :find_by_lookup_field

    def add_field_to_formsection formsection, field
      raise I18n.t("errors.models.form_section.add_field_to_form_section") unless formsection.editable
      field.merge!({'base_language' => formsection['base_language']})
      if field.type == 'subform'
        field.subform_section_id = "#{formsection.unique_id}_subform_#{field.name}".parameterize.underscore
        #Now make field name match subform section id
        field.name = field.subform_section_id
        create_subform(formsection, field)
      end
      formsection.fields.push(field)
      formsection.save
    end

    def create_subform(formsection, field)
      self.create_or_update_form_section({
                :visible=>false,
                :is_nested=>true,
                :core_form=>false,
                :editable=>true,
                :base_language=>formsection.base_language,
                :order_form_group => formsection.order_form_group,
                :order => formsection.order,
                :order_subform => 1,
                :unique_id=>field.subform_section_id,
                :parent_form=>formsection.parent_form,
                :name_all=>field.display_name,
                :description_all=>field.display_name
      })
    end

    def get_form_containing_field field_name
      all.find { |form| form.fields.find { |field| field.name == field_name || field.display_name == field_name } }
    end
    memoize_in_prod :get_form_containing_field

    def has_photo_form
      photo_form = get_by_unique_id('photos_and_audio')
      photo_form.present? && photo_form.visible
    end
    memoize_in_prod :has_photo_form

    def new_custom form_section, module_name = "CP"
      form_section[:core_form] = false   #Indicates this is a user-added form

      #TODO - need more elegant way to set the form's order
      #form_section[:order] = by_order.last ? (by_order.last.order + 1) : 1
      form_section[:order] = 999
      form_section[:order_form_group] = 999
      form_section[:order_subform] = 0
      form_section[:module_name] = module_name

      fs = FormSection.new(form_section)
      fs.unique_id = "#{module_name}_#{fs.name}".parameterize.underscore
      return fs
    end

    def change_form_section_state formsection, to_state
      formsection.enabled = to_state
      formsection.save
    end

    def find_mobile_forms_by_parent_form(parent_form = 'case')
      by_parent_form_and_mobile_form(key: [parent_form, true])
    end
    memoize_in_prod :find_mobile_forms_by_parent_form

    def get_allowed_visible_forms_sections(primero_module, parent_form, user, opts={})
      permitted_forms = FormSection.get_permitted_form_sections(primero_module, parent_form, user)
      FormSection.link_subforms(permitted_forms)
      visible_forms = FormSection.get_visible_form_sections(permitted_forms)
      FormSection.group_forms(visible_forms)
    end

    def determine_parent_form(record_type, apply_to_reports=false)
      if ["violation", "individual_victim"].include?(record_type)
        "incident"
      elsif record_type.starts_with?("reportable") && apply_to_reports
        # Used to figure out if reportable nested form belongs to incident, child, or tracing request.
        parent_record_type = Object.const_get(record_type.camelize).parent_record_type.to_s.downcase
        parent_record_type == "child" ? "case" : parent_record_type
      else
        record_type
      end
    end


    #TODO: NEXT TIME ANYBODY TOUCHES THIS METHOD FOR ANY REASON,
    #      ADD AN EXTRA DAY TO YOUR ESTIMATE AND REFACTOR THIS MONSTER, ADD RSPECS
    #      THEN THOROUGHLY RETEST EXPORTS AND REPORTS
    def all_exportable_fields_by_form(primero_modules, record_type, user, types, apply_to_reports=false)
      custom_exportable = {}
      if primero_modules.present?
        parent_form = determine_parent_form(record_type, apply_to_reports)
        #hide_on_view_page will filter fields for readonly users.
        readonly_user = user.readonly?(parent_form)
        model = Record::model_from_name(parent_form)
        minimum_reportable_fields = model.minimum_reportable_fields.values.flatten
        nested_reportable_subform = Report.record_type_is_nested_reportable_subform?(parent_form, record_type)
        primero_modules.each do |primero_module|
          if record_type == 'violation'
            #Custom export does not have violation type, just reporting.
            #Copied this code from the old reporting method.
            #TODO - this can be improved
            forms = FormSection.get_permitted_form_sections(primero_module, parent_form, user)
            forms = forms.select{|f| f.is_violation? || !f.is_nested?}
          else
            if apply_to_reports
              #For reporting show all forms, not just the visible.
              forms = FormSection.get_permitted_form_sections(primero_module, parent_form, user)
              #For reporting avoid subforms.

              # Filtering out nested subform minus any selected reportable subforms.
              forms = forms.select do |f|
                if Report.record_type_is_nested_reportable_subform?(parent_form, record_type)
                  !f.is_nested? || Report.get_reportable_subform_record_field_name(parent_form ,record_type).eql?(f.unique_id)
                else
                  !f.is_nested?
                end
              end
            else
              #For custom export shows only visible forms.
              forms = FormSection.get_allowed_visible_forms_sections(primero_module, parent_form, user)
              #Need a plain structure.
              forms = forms.map{|key, forms_sections| forms_sections}.flatten
            end
          end
          custom_exportable[primero_module.name] = get_exportable_fields(forms, minimum_reportable_fields, parent_form,
                                                                         record_type, types, apply_to_reports,
                                                                         nested_reportable_subform, readonly_user)
        end
      end
      custom_exportable
    end

    #TODO - needs further refactoring
    def get_exportable_fields(forms, minimum_reportable_fields, parent_form, record_type, types, apply_to_reports, nested_reportable_subform, readonly_user)
      #Collect the information as: [[form name, fields list], ...].
      #fields list got the format: [field name, display name, type].
      #fields list for subforms got the format: [subform name:field name, display name, type]
      #Subforms will appears as another section because there is no way
      #to manage nested optgroup in choosen or select.

      include_field = (apply_to_reports ? lambda {|f| types.include?(f.type)} : lambda {|f| types.include?(f.type) && f.visible?})

      forms_and_fields = []
      forms.sort_by{|f| [f.order_form_group, f.order]}.each do |form|
        fields = []
        subforms = []
        # TODO: Refactor the mess below
        if apply_to_reports && nested_reportable_subform
          # Keep nested form and minimal fields only
          form.fields.select(&include_field).each do |f|
            if minimum_reportable_fields.include?(f.name) || form.unique_id == Report.get_reportable_subform_record_field_name(parent_form, record_type)
              add_field_to_fields(readonly_user, fields, f, apply_to_reports)
            end
          end
        else
          form.fields.select(&include_field).each do |f|
            if f.type == Field::SUBFORM
              #Process subforms fields only for custom exports, for now.
              if !apply_to_reports
                if f.subform_section.present?
                  #Collect subforms fields to build the section.
                  subform_fields = f.subform_section.fields.select{|sf| types.include?(sf.type) && sf.visible?}
                  subform_fields = subform_fields.map do |sf|
                    #TODO - do I need location block here?
                    ["#{f.name}:#{sf.name}", sf.display_name, sf.type] if !readonly_user || (readonly_user && !sf.hide_on_view_page)
                  end
                  subforms << ["#{form.name}:#{f.display_name}", subform_fields.compact]
                end
              end
            else
              #Not subforms fields.
              add_field_to_fields(readonly_user, fields, f, apply_to_reports)
            end
          end
        end
        #Add the section for the current form and the not subforms fields.
        forms_and_fields << [form.name, fields]
        #For every subform add the section as well.
        subforms.each{|subform| forms_and_fields << subform}
      end
      forms_and_fields.select{|f| f[1].present?}
    end

    def add_field_to_fields(readonly_user, fields, field, apply_to_reports)
      if !readonly_user || (readonly_user && !field.hide_on_view_page)
        if field.is_location?
          Location::ADMIN_LEVELS.each do |admin_level|
            #TODO - i18n
            Location.type_by_admin_level(admin_level).each do |lct_type|
              field_display = "#{field.display_name} - " + I18n.t("location.base_types.#{lct_type}") + " - ADM #{admin_level}"
              field_key = (apply_to_reports ? "#{field.name}#{admin_level}" : "#{field.name}|||location|||#{admin_level}|||#{field_display}")
              fields << ["#{field_key}", "#{field_display}", field.type]
            end
          end
        else
          fields << [field.name, field.display_name, field.type]
        end
      end
    end

    def find_locations_by_parent_form(parent_form = 'case')
      having_location_fields_by_parent_form(key: parent_form).all
    end
    memoize_in_prod :find_locations_by_parent_form

    def format_forms_for_mobile(form_sections, locale=nil, parent_form=nil)
      form_sections = form_sections.reduce([]){|memo, elem| memo + elem[1]}.flatten

      forms_hash = mobile_forms_to_hash(form_sections, locale).group_by { |f| mobile_form_type(f['parent_form']) }
      mobile_form_type = mobile_form_type(parent_form)
      forms_hash[mobile_form_type].each{|form_hash| simplify_mobile_form(form_hash)}
      forms_hash
    end

    def mobile_forms_to_hash(form_sections, locale=nil)
      locales = ((locale.present? && Primero::Application::locales.include?(locale)) ? [locale] : Primero::Application::locales)
      lookups = Lookup.all.all
      locations = self.include_locations_for_mobile? ? Location.all_names(locale: I18n.locale) : []
      form_sections.map {|form| mobile_form_to_hash(form, locales, lookups, locations)}
    end

    def mobile_form_to_hash(form, locales, lookups, locations)
      form_hash = form.localized_attributes_hash(locales)
      form_hash['fields'] = mobile_fields_to_hash(form, locales, lookups, locations)
      form_hash
    end

    def mobile_fields_to_hash(form, locales, lookups, locations)
      form.all_mobile_fields.map do |f|
        field_hash = f.localized_attributes_hash(locales, lookups, locations)
        field_hash['subform'] = mobile_form_to_hash(f.subform, locales, lookups, locations) if f.subform.present?
        field_hash
      end
    end

    def simplify_mobile_form(form_hash)
      form_hash.slice!('unique_id', :name, 'order', :help_text, 'base_language', 'fields')
      form_hash['fields'].each do |field|
        field.slice!('name', 'disabled', 'multi_select', 'type', 'subform', 'required', 'option_strings_source',
          'show_on_minify_form','mobile_visible', :display_name, :help_text, :option_strings_text, 'date_validation')
        simplify_mobile_form(field['subform']) if (field['type'] == 'subform' && field['subform'].present?)
      end
    end

    #This keeps the forms compatible with the mobile API
    def mobile_form_type(parent_form)
      case parent_form
        when 'case'
          'Children'
        when 'child'
          'Children'
        when 'tracing_request'
          'Enquiries' #TODO: This may be controversial
        else
          parent_form.camelize.pluralize
      end
    end

    def import_translations(form_hash={}, locale)
      if locale.present? && Primero::Application::locales.include?(locale)
        unique_id = form_hash.keys.first
        if unique_id.present?
          #We have to bypass memoization here
          form = self.old_by_unique_id(key: unique_id).first
          if form.present?
            form.update_translations(form_hash.values.first, locale)
            Rails.logger.info "Updating Form translation: Form [#{form.unique_id}] locale [#{locale}]"
            form.save!
          else
            Rails.logger.error "Error importing translations: Form for ID [#{unique_id}] not found"
          end
        else
          Rails.logger.error "Error importing translations: Form ID not present"
        end
      else
        Rails.logger.error "Error importing translations: locale not present"
      end
    end

    def get_append_only_subforms
      get_subforms(all.all).select(&:subform_append_only)
    end

    memoize_in_prod :get_append_only_subforms

    def get_append_only_subform_ids
      get_append_only_subforms.map(&:unique_id)
    end

    memoize_in_prod :get_append_only_subform_ids

  end

  #Returns the list of field to show in collapsed subforms.
  #If there is no list defined, it will returns the first one of the fields.
  def collapsed_list
    if self.collapsed_fields.empty?
      [self.fields.select {|field| field.visible? }.first].compact
    else
      #Make sure we get the field in the order by collapsed_fields array.
      map = Hash[*self.fields.collect { |field| [field.name, field] }.flatten]
      self.collapsed_fields.collect {|field_name| map[field_name]}
    end
  end

  # TODO: all searchable/filterable methods can possible be refactored
  def all_text_fields
    self.fields.select { |field| field.type == Field::TEXT_FIELD || field.type == Field::TEXT_AREA }
  end

  def all_matchable_fields
    self.fields.select { |field| field.matchable.present? && field.matchable == true }
  end

  # Updates each field's matchable property to true/false depending on whether or not it is in the field_list
  #Input:  a list of fields that should be matchable
  def update_fields_matchable(field_list=[])
    self.fields.each {|field| field.matchable = field_list.include?(field.name)}
  end

  def all_searchable_fields
    self.fields.select do |field|
      [Field::TEXT_AREA].include? field.type
    end
  end

  def all_searchable_date_fields
    self.fields.select do |field|
      [Field::DATE_FIELD, Field::DATE_RANGE].include?(field.type) && !field.date_include_time
    end
  end

  def all_searchable_date_time_fields
    self.fields.select do |field|
      [Field::DATE_FIELD, Field::DATE_RANGE].include?(field.type) && field.date_include_time
    end
  end

  def all_searchable_boolean_fields
    self.fields.select do |field|
      Field::TICK_BOX == field.type
    end
  end

  def all_filterable_fields
    self.fields.select  do |field|
      [Field::TEXT_FIELD, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::NUMERIC_FIELD].include? field.type unless field.multi_select
    end
  end

  def all_filterable_multi_fields
    self.fields.select  do |field|
      [Field::SELECT_BOX].include? field.type if field.multi_select
    end
  end

  def all_filterable_numeric_fields
    self.fields.select  do |field|
      [Field::NUMERIC_FIELD].include? field.type
    end
  end

  def all_tally_fields
    self.fields.select {|f| f.type == Field::TALLY_FIELD}
  end

  def all_location_fields
    self.fields.select{|f| f.is_location?}
  end

  def all_mobile_fields
    self.fields.select{|f| f.is_mobile?}
  end

  def localized_attributes_hash(locales)
    attributes = self.attributes.clone
    #convert top level attributes
    FormSection.localized_properties.each do |property|
      attributes[property] = {}
      Primero::Application::locales.each do |locale|
        key = "#{property.to_s}_#{locale.to_s}"
        value = attributes[key].nil? ? "" : attributes[key]
        attributes[property][locale] = value if locales.include? locale
        attributes.delete(key)
      end
    end
    attributes
  end

  def properties= properties
    properties.each_pair do |name, value|
      self.send("#{name}=", value) unless value == nil
    end
  end

  def add_text_field field_name
    self["fields"] << Field.new_text_field(field_name)
  end

  def add_field field
    self["fields"] << Field.new(field)
  end

  def update_field_as_highlighted field_name
    field = fields.find { |field| field.name == field_name }
    existing_max_order = FormSection.highlighted_fields.
        map(&:highlight_information).
        map(&:order).
        max
    order = existing_max_order.nil? ? 1 : existing_max_order + 1
    field.highlight_with_order order
    save
  end

  def remove_field_as_highlighted field_name
    field = fields.find { |field| field.name == field_name }
    field.unhighlight
    save
  end

  def section_name
    unique_id
  end

  def is_first field_to_check
    field_to_check == fields.at(0)
  end

  def is_last field_to_check
    field_to_check == fields.at(fields.length-1)
  end

  def delete_field field_to_delete
    field = fields.find { |field| field.name == field_to_delete }
    raise I18n.t("errors.models.form_section.delete_field") if !field.editable?
    if (field)
      field_index = fields.index(field)
      fields.delete_at(field_index)
      save()
    end
  end

  def field_order field_name
    field_item = fields.find { |field| field.name == field_name }
    return fields.index(field_item)
  end

  def order_fields new_field_names
    new_fields = []
    new_field_names.each { |name| new_fields << fields.find { |field| field.name == name } }
    self.fields = new_fields
    self.save
  end

  def is_violation?
    FormSection.violation_forms.map(&:unique_id).include? self.unique_id
  end

  def is_violations_group?
    self.form_group_id == 'violations'
  end

  def is_violation_wrapper?
    self.fields.present? &&
    self.fields.select{|f| f.type == Field::SUBFORM}.any? do |f|
      Incident.violation_id_fields.keys.include?(f.subform_section_id)
    end
  end

  #TODO add rspec test
  def generate_options_keys
    self.fields.each{|field| field.generate_options_keys}
  end

  def sync_options_keys
    self.fields.each{|field| field.sync_options_keys}
  end

  #if a new form_group_id was added during edit/create, then add that form group to the form_group lookup
  def sync_form_group
    return unless self.changed.include?('form_group_id')
    return if self.form_group_id.blank?

    #If form_group already exists, nothing to do
    form_group = Lookup.form_group_name(self.form_group_id, self.parent_form, self.module_name)
    return if form_group.present?

    #If added manually by the user, form_group_id at this point is just what the user typed in
    #Use that value for the form group description.  Parameterize it to use as the id
    new_id = self.form_group_id.parameterize(separator: '_')
    Lookup.add_form_group(new_id, self.form_group_id, self.parent_form, self.module_name)
    self.form_group_id = new_id
  end

  def field_by_name(field_name)
    self.fields.find{|f| f.name == field_name}
  end

  def update_translations(form_hash={}, locale)
    if locale.present? && Primero::Application::locales.include?(locale)
      form_hash.each do |key, value|
        # Form Group Name is now a calculated field based on form_group_id
        # Form Group Translations are handled through Lookup
        # Using elsif to exclude form_group_name in legacy translation files that may still include form_group_name
        if key == 'fields'
          update_field_translations(value, locale)
        elsif key != 'form_group_name'
          self.send("#{key}_#{locale}=", value)
        end
      end
    else
      Rails.logger.error "Form translation not updated: Invalid locale [#{locale}]"
    end
  end

  protected

  def recalculate_subform_permissions
    if self.fields.any?{|f| f.type == Field::SUBFORM}
      Role.all.each do |role|
        if role.permitted_form_ids.include?(self.unique_id)
          role.add_permitted_subforms
          role.save
        end
      end
      PrimeroModule.all.each do |primero_module|
        if primero_module.associated_form_ids.include?(self.unique_id)
          primero_module.add_associated_subforms
          primero_module.save
        end
      end
    end
  end

  def validate_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    if (name =~ special_characters) || (name =~ white_spaces)
      return errors.add(:name, I18n.t("errors.models.form_section.format_of_name"))
    else
      return true
    end
  end

  def validate_visible_field
    self.visible = true if self.perm_visible?
    if self.perm_visible? && self.visible == false
      errors.add(:visible, I18n.t("errors.models.form_section.visible_method"))
    end
    true
  end

  def validate_fixed_order
    self.fixed_order = true if self.perm_enabled?
    if self.perm_enabled? && self.fixed_order == false
      errors.add(:fixed_order, I18n.t("errors.models.form_section.fixed_order_method"))
    end
    true
  end

  def validate_perm_visible
    self.perm_visible = true if self.perm_enabled?
    if self.perm_enabled? && self.perm_visible == false
      errors.add(:perm_visible, I18n.t("errors.models.form_section.perm_visible_method"))
    end
    true
  end

  def validate_unique_id
    form_section = FormSection.get_by_unique_id(self.unique_id)
    unique = form_section.nil? || form_section.id == self.id
    unique || errors.add(:unique_id, I18n.t("errors.models.form_section.unique_id", :unique_id => unique_id))
  end

  #Make sure that within the record, the same field isn't defined with differing data types
  def validate_datatypes
    if !self.is_nested && self.fields.present?
      field_names = self.fields.map(&:name)
      all_current_fields = FormSection.fields(keys: field_names).rows.reduce({}) do |accum, row|
        if !row.value['on_nested'] && (self.parent_form == row.value['parent_form'])
          type = row.value['type']
          accum[row.key] = [type, row.value['multi_select'].present?]
        end
        accum
      end
      fields.each do |field|
        current_type = all_current_fields[field.name]
        if current_type.present? && (current_type != [field.type, field.multi_select.present?])
          #Allow changing from text_field to textarea or from textarea to text_field
          next if changing_between_text_field_and_textarea?(current_type.first, field.type)
          errors.add(:fields, I18n.t("errors.models.field.change_type_existing_field", field_name: field.name, form_name: self.name))
          return false
        end
      end
    end
    return true
  end

  def changing_between_text_field_and_textarea?(current_type, new_type)
    [Field::TEXT_FIELD, Field::TEXT_AREA].include?(current_type) && [Field::TEXT_FIELD, Field::TEXT_AREA].include?(new_type)
  end

  def create_unique_id
    self.unique_id = UUIDTools::UUID.timestamp_create.to_s.split('-').first if self.unique_id.nil?
  end

  private

  # Location::LIMIT_FOR_API is a hard limit
  # The SystemSettings limit is a soft limit that lets us adjust down below the hard limit if necessary
  def self.include_locations_for_mobile?
    location_count = Location.count
    return false if location_count > Location::LIMIT_FOR_API
    ss_limit = SystemSettings.current.try(:location_limit_for_api)
    return_value = ss_limit.present? ? location_count < ss_limit : true
  end

  def update_field_translations(fields_hash={}, locale)
    fields_hash.each do |key, value|
      field = self.field_by_name(key)
      if field.present?
        field.update_translations(value, locale)
      end
    end
  end

end
