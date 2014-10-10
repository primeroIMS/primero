class FormSection < CouchRest::Model::Base
  include PrimeroModel
  include PropertiesLocalization
  include Importable


  #TODO - include Namable - will require a fair amount of refactoring

  use_database :form_section
  localize_properties [:name, :help_text, :description]
  property :unique_id
  property :parent_form
  property :visible, TrueClass, :default => true
  property :order, Integer
  property :order_form_group, Integer
  property :order_subform, Integer
  property :form_group_keyed, TrueClass, :default => false
  property :form_group_name
  property :fields, [Field]
  property :editable, TrueClass, :default => true
  property :fixed_order, TrueClass, :default => false
  property :perm_visible, TrueClass, :default => false
  property :perm_enabled, TrueClass, :default => false
  property :core_form, TrueClass, :default => true
  property :validations, [String]
  property :base_language, :default=>'en'
  property :is_nested, TrueClass, :default => false
  property :is_first_tab, TrueClass, :default => false
  property :initial_subforms, Integer, :default => 0
  property :collapsed_fields, [String], :default => []
  #Will display a help text on show page if the section is empty.
  property :display_help_text_view, TrueClass, :default => false

  design do
    view :by_unique_id
    view :by_parent_form
    view :by_order
    view :subform_form,
      :map => "function(doc) {
                if (doc['couchrest-type'] == 'FormSection'){
                  if (doc['fields'] != null){
                    for(var i = 0; i<doc['fields'].length; i++){
                      var field = doc['fields'][i];
                      if (field['subform_section_id'] != null){
                        emit(field['subform_section_id'], doc._id);
                      }
                    }
                  }
                }
              }"
  end

  validates_presence_of "name_#{I18n.default_locale}", :message => I18n.t("errors.models.form_section.presence_of_name")
  validate :valid_presence_of_base_language_name
  validate :validate_name_format
  validate :validate_unique_id
  validate :validate_unique_name
  validate :validate_visible_field
  validate :validate_fixed_order
  validate :validate_perm_visible

  def inspect
    "FormSection(#{self.name}, form_group_name => '#{self.form_group_name}')"
  end

  def valid_presence_of_base_language_name
    if base_language==nil
      self.base_language='en'
    end
    base_lang_name = self.send("name_#{base_language}")
    [!(base_lang_name.nil?||base_lang_name.empty?), I18n.t("errors.models.form_section.presence_of_base_language_name", :base_language => base_language)]
  end

  def initialize(properties={}, options={})
    self["fields"] = []
    super properties, options
    create_unique_id
  end

  alias to_param unique_id

  class << self
    extend Memoist

    def get_unique_instance(attributes)
      get_by_unique_id(attributes['unique_id'])
    end

    def enabled_by_order
      by_order.select(&:visible?)
    end

    def all_child_field_names
      all_child_fields.map { |field| field["name"] }
    end

    def all_visible_form_fields(parent_form = 'case')
      find_all_visible_by_parent_form(parent_form).map do |form_section|
        form_section.fields.find_all(&:visible)
      end.flatten
    end

    def all_child_fields
      all.map do |form_section|
        form_section.fields
      end.flatten
    end

    def enabled_by_order_without_hidden_fields
      enabled_by_order.each do |form_section|
        form_section['fields'].map! { |field| field if field.visible? }
        form_section['fields'].compact!
      end
    end

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
        form_section.save
      else
        Rails.logger.info {"Creating form section #{unique_id}"}
        return self.create!(properties)
      end
      form_section
    end

    def find_all_visible_by_parent_form parent_form
      #by_parent_form(:key => parent_form).select(&:visible?).sort_by{|e| [e.order_form_group, e.order, e.order_subform]}
      find_by_parent_form(parent_form).select(&:visible?)
    end

    def find_by_parent_form parent_form
      #TODO: the sortby can be moved to a couchdb view
      by_parent_form(:key => parent_form).sort_by{|e| [e.order_form_group, e.order, e.order_subform]}
    end
  end

  #Returns the list of field to show in collapsed subforms.
  #If there is no list defined, it will returns the first one of the fields.
  def collapsed_list
    if self.collapsed_fields.empty?
      [self.fields.select {|field| field.visible? }.first]
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

  def all_searchable_fields
    self.fields.select do |field|
      [Field::TEXT_AREA].include? field.type
    end
  end

  def all_searchable_date_fields
    self.fields.select do |field|
      [Field::DATE_FIELD, Field::DATE_RANGE].include? field.type
    end
  end

  def all_filterable_fields
    self.fields.select  do |field|
      [Field::TEXT_FIELD, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::CHECK_BOXES, Field::NUMERIC_FIELD].include? field.type unless field.multi_select
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

  def self.get_by_unique_id unique_id
    by_unique_id(:key => unique_id).first
  end


  #TODO - can this be done more efficiently?
  def self.find_form_groups_by_parent_form parent_form
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


  #Given an arbitrary list of forms go through and link up the forms to subforms.
  #Functionally this isn't important, but this will improve performance if the list
  #contains both the top forms and the subforms by avoiding extra queries.
  #TODO: Potentially this method is expensive
  def self.link_subforms(forms)
    subforms_hash = forms.reduce({}) do |hash, form|
      hash[form.unique_id] = form unless form.visible?
      hash
    end

    forms.map{|f| f.fields}.flatten.each do |field|
      if field.type == Field::SUBFORM && field.subform_section_id
        field.subform ||= subforms_hash[field.subform_section_id]
      end
    end

    return forms
  end


  #Return a hash of subforms, where the keys are the form groupings
  def self.group_forms(forms)
    grouped_forms = {}

    #Order these forms by group and form
    sorted_forms = forms.sort_by{|f| [f.order_form_group, f.order]}

    if sorted_forms.present?
      grouped_forms = sorted_forms.group_by{|f| f.form_group_name}
    end
    return grouped_forms
  end

  def self.get_visible_form_sections(form_sections)
    visible_forms = []
    visible_forms = form_sections.select{|f| f.visible?} if form_sections.present?

    return visible_forms
  end

  def self.filter_subforms(form_sections)
    forms = []
    forms = form_sections.select{|f| (f.is_nested.blank? || f.is_nested != true)} if form_sections.present?

    return forms
  end


  #Return only those forms that can be accessed by the user given their role permissions and the module
  def self.get_permitted_form_sections(primero_module, parent_form, user)
    #Get the form sections that the  user is permitted to see and intersect them with the forms associated with the module
    user_form_ids = user.permitted_form_ids
    module_form_ids = primero_module.present? ? primero_module.associated_form_ids : []
    allowed_form_ids = user_form_ids & module_form_ids

    form_sections = []
    if allowed_form_ids.present?
      form_sections = FormSection.by_unique_id(keys: allowed_form_ids).all
    end

    #Now exclude the forms that do not belong to this record type
    #TODO: This is too chatty. Better to ask for exactly what you need from DB
    form_sections = form_sections.select{|f| f.parent_form == parent_form}

    return form_sections
  end



  def self.add_field_to_formsection formsection, field
    raise I18n.t("errors.models.form_section.add_field_to_form_section") unless formsection.editable
    field.merge!({'base_language' => formsection['base_language']})
    formsection.fields.push(field)
    formsection.save
  end

  def self.get_form_containing_field field_name
    all.find { |form| form.fields.find { |field| field.name == field_name || field.display_name == field_name } }
  end

  #TODO -RSE- see how this is affected by order_form_group
  def self.new_with_order form_section
    form_section[:order] = by_order.last ? (by_order.last.order + 1) : 1
    FormSection.new(form_section)
  end

  def self.change_form_section_state formsection, to_state
    formsection.enabled = to_state
    formsection.save
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

  def self.highlighted_fields
    all.map do |form|
      form.fields.select { |field| field.is_highlighted? }
    end.flatten
  end

  def self.sorted_highlighted_fields
    highlighted_fields.sort { |field1, field2| field1.highlight_information.order.to_i <=> field2.highlight_information.order.to_i }
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

  protected

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

  def validate_unique_name
  unique = FormSection.all.all? { |f| id == f.id || name == nil || name.empty? || name!= f.name || parent_form != f.parent_form }
  unique || errors.add(:name, I18n.t("errors.models.form_section.unique_name", :name => name))
  end

  def create_unique_id
    self.unique_id = UUIDTools::UUID.timestamp_create.to_s.split('-').first if self.unique_id.nil?
  end
end
