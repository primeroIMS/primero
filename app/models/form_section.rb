class FormSection < ApplicationRecord

  include LocalizableJsonProperty
  include Configuration
  # include Importable # TODO: This will need to be rewritten
  # include Memoizable

  RECORD_TYPES = %w[case incident tracing_request].freeze

  localize_properties :name, :help_text, :description

  has_many :fields, -> { order(:order) }, dependent: :destroy
  accepts_nested_attributes_for :fields
  has_many :collapsed_fields, class_name: 'Field', foreign_key: 'collapsed_field_for_subform_section_id'
  has_and_belongs_to_many :roles
  has_and_belongs_to_many :primero_modules, inverse_of: :form_sections

  attr_accessor :module_name
  attribute :collapsed_field_names

  validate :validate_fields_unique_name
  validate :validate_name_in_english
  validate :validate_name_format
  validates :unique_id, presence: true, uniqueness: { message: 'errors.models.form_section.unique_id' }

  after_initialize :defaults, :generate_unique_id, unless: :persisted?
  before_validation :calculate_fields_order
  before_save :sync_form_group, :recalculate_editable
  after_save :recalculate_collapsed_fields

  # TODO: Move to migration
  def defaults
    %w[order order_form_group order_subform initial_subforms].each { |p| self[p] ||= 0 }
  end

  def generate_unique_id
    if self.name_en.present? && self.unique_id.blank?
      self.unique_id = self.name_en.gsub(/[^A-Za-z0-9_ ]/, '').parameterize.underscore
    end
  end

  # TODO: This method will go away after UIUX refactor
  def form_group_name(opts={})
    locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
    return name(locale) if form_group_id.blank?

    form_group_name_all[locale.to_s]
  end

  # This replaces form_group_name above
  def form_group_name_all(lookups = nil)
    return name_i18n if form_group_id.blank?

    Lookup.form_group_name_all(form_group_id, parent_form, module_name, lookups)
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

    def permitted_api_params
      [
        'id', 'unique_id', { 'name' => {} }, { 'help_text' => {} }, { 'description' => {} }, 'parent_form',
        'visible', 'order', 'order_form_group', 'order_subform', 'form_group_keyed', 'form_group_id', 'is_nested',
        'is_first_tab', 'initial_subforms', 'subform_prevent_item_removal', 'subform_append_only',
        'subform_header_links', 'display_help_text_view', 'shared_subform', 'shared_subform_group',
        'is_summary_section', 'hide_subform_placeholder', 'mobile_form', 'collapsed_field_names'
      ]
    end

    def new_with_properties(form_properties, module_ids = [])
      form_section = FormSection.new(form_properties)
      form_section.primero_modules = PrimeroModule.where(unique_id: module_ids) if module_ids.present?
      form_section
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
          attributes = field.attributes.select{|k,_| !([:id, :form_section_id, 'id', 'form_section_id'].include?(k))}
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

    def form_group_lookups
      Lookup.where("unique_id like 'lookup-form-group-%'")
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

    def list(params={})
      form_sections = all.includes(:fields, :collapsed_fields, :primero_modules)
      form_sections = form_sections.where(parent_form: params[:record_type]) if params[:record_type]
      form_sections = form_sections.where(primero_modules: { unique_id: params[:module_id] }) if params[:module_id]
      form_sections
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

  def merge_properties(form_properties, module_ids = [])
    formi18n_props = FieldI18nService.merge_i18n_properties(self.attributes, form_properties)
    formi18n_props = form_properties.merge(formi18n_props)

    if form_properties.key?('fields_attributes')
      fields = []
      (form_properties['fields_attributes'] || []).each do |field_props|
        field = self.fields.find{ |f| f.name == field_props["name"] }
        if field.present?
          fieldi18n_props = FieldI18nService.merge_i18n_properties(field.attributes, field_props)
          fieldi18n_props = field_props.merge(fieldi18n_props)
          fields << field.attributes.merge(fieldi18n_props)
        else
          fields <<  field_props
        end
      end
      formi18n_props['fields_attributes'] = fields

      field_names = form_properties['fields_attributes'].map{ |field| field['name'] }
      self.fields
          .select{ |field| field_names.exclude?(field.name) && field.editable? }
          .each(&:mark_for_destruction)
    end

    self.assign_attributes(formi18n_props)

    self.primero_modules = PrimeroModule.where(unique_id: module_ids) if module_ids.present?
  end

  def permitted_destroy!
    if !self.editable? || self.core_form?
      raise Errors::ForbiddenOperation
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

  def validate_fields_unique_name
    return true if self.fields.blank?
    field_names = self.fields.map(&:name)
    if field_names.length > field_names.dup.uniq.length
      return errors.add(:fields, 'errors.models.form_section.unique_field_names')
    end
    true
  end

  def calculate_fields_order
    return if fields.blank?

    fields.each_with_index do |field, index|
      field.order = index if field.order.nil?
    end
  end

  def recalculate_editable
    if self.editable?
      self.editable = self.fields.select do |field|
        if field.type == Field::SUBFORM && field.subform_section.present?
          !field.editable? || !field.subform_section.editable?
        else
          !field.editable?
        end
      end.size.zero?
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
