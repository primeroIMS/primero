class FormSection < ApplicationRecord

  include LocalizableJsonProperty
  include Configuration
  #include Importable #TODO: This will need to be rewritten
  # include Memoizable

  RECORD_TYPES = ['case', 'incident', 'tracing_request']

  localize_properties :name, :help_text, :description

  has_many :fields, -> { order(:order) }
  has_many :collapsed_fields, class_name: 'Field', foreign_key: 'collapsed_field_for_subform_section_id'
  has_and_belongs_to_many :roles
  has_and_belongs_to_many :primero_modules, inverse_of: :form_sections

  attr_accessor :module_name
  attribute :collapsed_field_names

  validate :validate_name_in_english
  validate :validate_name_format
  validates :unique_id, presence: true, uniqueness: { message: 'errors.models.form_section.unique_id' }

  after_initialize :defaults, :generate_unique_id
  before_validation :calculate_fields_order
  before_save :sync_form_group
  after_save :recalculate_collapsed_fields

  #TODO: Move to migration
  def defaults
    %w(order order_form_group order_subform initial_subforms).each{|p| self[p] ||= 0}
  end

  def generate_unique_id
    if self.name_en.present? && self.unique_id.blank?
      self.unique_id = self.name_en.gsub(/[^A-Za-z0-9_ ]/, '').parameterize.underscore
    end
  end

  def form_group_name(opts={})
    locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
    return name(locale) if self.form_group_id.blank?
    Lookup.form_group_name(self.form_group_id, self.parent_form, self.module_name, locale: locale)
  end

  def localized_property_hash(locale=Primero::Application::BASE_LANGUAGE, show_hidden_fields=false)
    lh = localized_hash(locale)
    fldz = {}
    self.fields.each { |f| fldz[f.name] = f.localized_property_hash locale if (show_hidden_fields || f.visible?)}
    lh['fields'] = fldz
    lh
  end

  def inspect
    "FormSection(#{self.name}, form_group_id => '#{self.form_group_id}')"
  end

  alias_attribute :to_param, :unique_id

  class << self

    def all_filterable_field_names(foo)
      []
    end

    def memoized_dependencies
      [Field]
    end

    #TODO: Used by importer. Refactor?
    def get_unique_instance(attributes)
      find_by(unique_id: attributes['unique_id'])
    end
    #memoize_in_prod :get_unique_instance

    #Given a list of forms, return their subforms
    def get_subforms(forms)
      form_ids = forms.map(&:id)
      subform_fields = Field.includes(:subform).where(form_section_id: form_ids, type: Field::SUBFORM)
      subform_fields.map(&:subform).compact
    end
    #memoize_in_prod :get_subforms

    def all_forms_grouped_by_parent(include_subforms=false)
      forms = FormSection.where(is_nested: false)
      forms = forms.unscope(:where) if include_subforms
      forms.group_by{|f| f.parent_form}
    end
    #memoize_in_prod :all_forms_grouped_by_parent

    #Create the form section if does not exists.
    #If the form section does exist will attempt
    #to create fields if the fields does not exists.
    def create_or_update_form_section(properties = {})
      unique_id = properties[:unique_id]
      return nil if unique_id.blank?
      fields = properties[:fields]

      form_section = self.find_by(unique_id: unique_id)
      if form_section.present?
        Rails.logger.info {"Updating form section #{unique_id}"}
        fields = fields.map do |field|
          updated_field = Field.find_or_initialize_by(name: field.name, form_section_id: form_section.id)
          attributes = field.attributes.reject{|k,_| !([:id, :form_section_id].include?(k))}
          updated_field.assign_attributes(attributes)
          updated_field
        end
        properties[:fields] = fields
        form_section.update_attributes(properties)
        return form_section
      else
        Rails.logger.info {"Creating form section #{unique_id}"}
        return FormSection.create!(properties)
      end
    end
    alias :create_or_update :create_or_update_form_section

    #TODO: This method may be removed, depending on how the all_searchable_* get refactored
    def find_by_parent_form(parent_form, subforms=true)
      forms = FormSection.where(parent_form: parent_form, is_nested: false)
      forms = forms.unscope(where: :is_nested) if subforms
      forms.order(order_form_group: :asc, order: :asc, order_subform: :asc)
    end
    #memoize_in_prod :find_by_parent_form

    def violation_forms
      #TODO: Fix this when we make MRM work
      # ids = Incident.violation_id_fields.keys
      # FormSection.by_unique_id(keys: ids).all
      []
    end
    #memoize_in_prod :violation_forms

    #TODO: This needs to be made not hard-coded. Used only in Exporters to exclude binary data
    def binary_form_names
      ['Photos and Audio', 'Other Documents', 'BID Records', 'BIA Records']
    end

    #Force eager loading of subforms
    def link_subforms(forms)
      subform_fields = forms.map(&:fields).flatten.select{|f| f.type == Field::SUBFORM}
      ActiveRecord::Associations::Preloader.new.preload(subform_fields, :subform)
      subforms = subform_fields.map(&:subform)
      ActiveRecord::Associations::Preloader.new.preload(subforms, [:fields, :collapsed_fields])
      return forms
    end
    #memoize_in_prod :link_subforms

    #Return a hash of subforms, where the keys are the form groupings
    # TODO: This method might no longer be relevant. Investigate! We should avoid sorting in Ruby. UIUX?
    def group_forms(forms)
      grouped_forms = {}

      #Order these forms by group and form
      sorted_forms = forms.sort_by{|f| [f.order_form_group, f.order]}

      if sorted_forms.present?
        grouped_forms = sorted_forms.group_by{|f| f.form_group_name}
      end
      return grouped_forms
    end
    #memoize_in_prod :group_forms

    def form_sections_by_ids_and_parent_form(form_ids, parent_form)
      FormSection.find_by_parent_form(parent_form, true).where(unique_id: form_ids)
    end

    def add_field_to_formsection(formsection, field)
      raise I18n.t("errors.models.form_section.add_field_to_form_section") unless formsection.editable
      field.form_section = formsection
      if field.type == Field::SUBFORM
        subform = create_subform(formsection, field)
        field.subform_section_id = subform.id
      end
      field.save
    end

    def create_subform(formsection, field)
      self.create_or_update_form_section({
                visible: false,
                is_nested: true,
                core_form: false,
                editable: true,
                order_form_group: formsection.order_form_group,
                order: formsection.order,
                order_subform: 1,
                unique_id: field.name,
                parent_form: formsection.parent_form,
                name_all: field.display_name,  #TODO: is _all or _en better?
                description_all: field.display_name
      })
    end

    def has_photo_form
      photo_form = find_by(unique_id: 'photos_and_audio')
      photo_form.present? && photo_form.visible
    end
    # memoize_in_prod :has_photo_form

    def new_custom(form_section, module_name = "CP")
      form_section[:core_form] = false   #Indicates this is a user-added form

      #TODO - need more elegant way to set the form's order
      #form_section[:order] = by_order.last ? (by_order.last.order + 1) : 1
      form_section[:order] = 999
      form_section[:order_form_group] = 999
      form_section[:order_subform] = 0
      form_section[:module_name] = module_name

      fs = FormSection.new(form_section)
      fs.unique_id = "#{module_name}_#{fs.name_en}".parameterize.underscore
      return fs
    end

    def determine_parent_form(record_type, apply_to_reports=false)
      if record_type == "violation"
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
        model = Record::model_from_name(parent_form)
        user_can_edit = user.can?(:write, model)
        minimum_reportable_fields = model.minimum_reportable_fields.values.flatten
        nested_reportable_subform = Report.record_type_is_nested_reportable_subform?(parent_form, record_type)
        primero_modules.each do |primero_module|
          if record_type == 'violation'
            #Custom export does not have violation type, just reporting.
            #Copied this code from the old reporting method.
            #TODO - this can be improved
            forms = user.permitted_forms(primero_module, parent_form)
            forms = forms.select{|f| f.is_violation? || !f.is_nested?}
          else
            if apply_to_reports
              #For reporting show all forms, not just the visible.
              forms = user.permitted_forms(primero_module, parent_form)
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
              forms = user.permitted_forms(primero_module, parent_form, true)
              #Need a plain structure.
              forms = forms.map{|key, forms_sections| forms_sections}.flatten
            end
          end
          custom_exportable[primero_module.name] = get_exportable_fields(forms, minimum_reportable_fields, parent_form,
                                                                         record_type, types, apply_to_reports,
                                                                         nested_reportable_subform, user_can_edit)
        end
      end
      custom_exportable
    end

    #TODO - needs further refactoring
    def get_exportable_fields(forms, minimum_reportable_fields, parent_form, record_type, types, apply_to_reports, nested_reportable_subform, user_can_edit)
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
              add_field_to_fields(user_can_edit, fields, f, apply_to_reports)
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
                    ["#{f.name}:#{sf.name}", sf.display_name, sf.type] if user_can_edit || (!user_can_edit && !sf.hide_on_view_page)
                  end
                  subforms << ["#{form.name}:#{f.display_name}", subform_fields.compact]
                end
              end
            else
              #Not subforms fields.
              add_field_to_fields(user_can_edit, fields, f, apply_to_reports)
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

    def add_field_to_fields(user_can_edit, fields, field, apply_to_reports)
      if user_can_edit || (!user_can_edit && !field.hide_on_view_page)
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

    def format_forms_for_mobile(form_sections, locale=nil, parent_form=nil)
      form_sections = form_sections.reduce([]){|memo, elem| memo + elem[1]}.flatten

      forms_hash = mobile_forms_to_hash(form_sections, locale).group_by { |f| mobile_form_type(f['parent_form']) }
      mobile_form_type = mobile_form_type(parent_form)
      forms_hash[mobile_form_type].each{|form_hash| simplify_mobile_form(form_hash)}
      forms_hash
    end

    def mobile_forms_to_hash(form_sections, locale=nil)
      locales = ((locale.present? && Primero::Application::locales.include?(locale)) ? [locale] : Primero::Application::locales)
      lookups = Lookup.all
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
        #TODO: Improve performance by eagerloading subform
        field_hash['subform'] = mobile_form_to_hash(f.subform, locales, lookups, locations) if f.subform_section_id.present?
        field_hash
      end
    end

    def simplify_mobile_form(form_hash)
      form_hash.slice!('unique_id', :name, 'order', :help_text, 'fields')
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
      if locale.present? && I18n.available_locales.include?(locale.try(:to_sym))
        unique_id = form_hash.keys.first
        if unique_id.present?
          form = FormSection.find_by(unique_id: unique_id)
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

    alias super_clear clear
    def clear
      Field.delete_all
      self.all.each do |f|
        f.roles.destroy(f.roles)
      end
      super_clear
    end

    def import(data)
      form = self.create!(data.except('fields'))
      Field.import(data['fields'], form)
    end

    def export
      self.all.map do |record|
        record.attributes.tap do |form|
          form.delete('id')
          form['fields'] = record.fields.map(&:export)
        end
      end
    end

  end

  def all_mobile_fields
    self.fields.select{|f| f.is_mobile?}
  end

  def localized_attributes_hash(locales)
    attributes = self.attributes.clone
    #convert top level attributes
    FormSection.localized_properties.each do |property|
      attributes[property] = {}
      key = "#{property.to_s}_i18n"
      Primero::Application::locales.each do |locale|
        value = attributes.try(:[], key).try(:[], locale) || ""
        attributes[property][locale] = value if locales.include? locale
      end
      attributes.delete(key)
    end
    attributes
  end

  #TODO: Do we still need this after splitting FormSection and Field?
  def properties= properties
    properties.each_pair do |name, value|
      self.send("#{name}=", value) unless value == nil
    end
  end

  #TODO: Refactor with Field. No longer necessary?
  # def add_field field
  #   self["fields"] << Field.new(field)
  # end

  def section_name
    unique_id
  end

  def delete_field(field_to_delete)
    field = self.fields.where(name: field_to_delete, editable: true).first
    if (field)
      field.destroy
    else
      raise I18n.t("errors.models.form_section.delete_field")
    end
  end

  #TODO: Refactor or deprecate when we change UIUX
  def order_fields(new_field_names)
    fields = self.fields
    new_field_names.each_with_index do |field_name, i|
      field = fields.find{|f| f.name == field_name}
      field.order = i
    end
    ActiveRecord::Base.transaction do
      fields.each(&:save)
    end
  end

  def is_violation?
    FormSection.violation_forms.map(&:unique_id).include? self.unique_id
  end

  def is_violations_group?
    #TODO MRM - pass english locale to form_group_name and/or have a better way to identify Violations
    self.form_group_name == 'Violations'
  end

  def is_violation_wrapper?
    self.fields.present? &&
    self.fields.select{|f| f.type == Field::SUBFORM}.any? do |f|
      Incident.violation_id_fields.keys.include?(f.subform.unique_id)
    end
  end

  #TODO: Rewrite after we migrated Lookup
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

  def recalculate_collapsed_fields
    # Awful code but gets the job done. If we have collapsed_field_names specified on the form
    # then set those pointers on the fields. If we dont have collapsed field_names specified,
    # but we do have pointers, let them be. Otherwise, the first field in a subform is the collapsed field.
    if self.is_nested
      fields_to_link = []
      fields_to_unlink = []

      if self.collapsed_field_names.present?
        self.fields.each do |field|
          if self.collapsed_field_names.include?(field.name)
            if field.collapsed_field_for_subform_section_id != self.id
              fields_to_link << field.id
            end
          elsif field.collapsed_field_for_subform_section_id
            fields_to_unlink << field.id
          end
        end
      else
        collapsed_fields = self.collapsed_fields.to_a
        unless collapsed_fields.size == 1 && collapsed_fields.first.try(:name) == self.fields.first.try(:name)
          fields.each_with_index do |field, index|
            if index == 0
              fields_to_link << field.id
            else
              fields_to_unlink << field.id
            end
          end
        end
      end

      if fields_to_link.present?
        Field.where(id: fields_to_link).update_all(collapsed_field_for_subform_section_id: self.id)
      end
      if fields_to_unlink.present?
        Field.where(id: fields_to_unlink).update_all(collapsed_field_for_subform_section_id: nil)
      end
    end
  end

  def validate_name_in_english
    unless name(Primero::Application::BASE_LANGUAGE).present?
      errors.add(:name, 'errors.models.form_section.presence_of_name')
      return false
    end
  end

  def validate_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    if (name =~ special_characters) || (name =~ white_spaces)
      return errors.add(:name, 'errors.models.form_section.format_of_name')
    else
      return true
    end
  end

  def calculate_fields_order
    if self.fields.present?
      self.fields.each_with_index do |field, index|
        field.order = index
      end
    end
  end


  private

  # Location::LIMIT_FOR_API is a hard limit
  # The SystemSettings limit is a soft limit that lets us adjust down below the hard limit if necessary
  # #TODO: Refactor with Location
  def self.include_locations_for_mobile?
    location_count = Location.count
    return false if location_count > Location::LIMIT_FOR_API
    ss_limit = SystemSettings.current.try(:location_limit_for_api)
    return_value = ss_limit.present? ? location_count < ss_limit : true
  end

  def update_field_translations(fields_hash={}, locale)
    fields_hash.each do |key, value|
      field = Field.find_by(name: key, form_section_id: self.id)
      if field.present?
        field.update_translations(value, locale)
      end
    end
  end

end
