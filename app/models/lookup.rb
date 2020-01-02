class Lookup < ApplicationRecord

  # include Memoizable
  include LocalizableJsonProperty
  include Configuration

  localize_properties :name
  localize_properties :lookup_values

  #TODO - seems to be causing trouble
  #TODO - remove  (No longer using in lookup seeds / config)
  DEFAULT_UNKNOWN_ID_TO_NIL = 'default_convert_unknown_id_to_nil'

  validate :validate_name_in_english
  validate :validate_values_keys_match

  before_validation :generate_values_keys
  before_validation :sync_lookup_values
  before_create :generate_unique_id
  before_destroy :check_is_being_used

  class << self

    def new_with_properties(lookup_properties)
      lookup = Lookup.new(
        id: lookup_properties[:id],
        unique_id: lookup_properties[:unique_id],
        name_i18n: lookup_properties[:name],
        lookup_values_i18n: lookup_properties[:values]
      )
    end

    def values(lookup_unique_id, lookups = nil, opts = {})
      locale = opts[:locale].presence || I18n.locale
      if lookups.present?
        lookup = lookups.find {|lkp| lkp.unique_id == lookup_unique_id}
      else
        lookup = Lookup.find_by(unique_id: lookup_unique_id)
      end
      lookup.present? ? (lookup.lookup_values(locale) || []) : []
    end
    # memoize_in_prod :values

    def values_for_select(lookup_id, lookups = nil, opts={})
      opts[:locale] = I18n.locale
      self.values(lookup_id, lookups, opts).map{|option| [option['display_text'], option['id']]}
    end

    # TODO: This method will go away after UIUX refactor
    def form_group_name(form_group_id, parent_form, module_name, opts={})
      form_group_names = self.form_group_name_all(form_group_id, parent_form, module_name)
      return '' if form_group_names.blank?
      locale = opts[:locale].presence || I18n.locale
      form_group_names[locale.to_s]
    end
    # memoize_in_prod :form_group_name

    # This replaces form_group_name above
    def form_group_name_all(form_group_id, parent_form, module_name, lookups = nil)
      lookup_ids = if module_name.present?
                     ["lookup-form-group-#{module_name.downcase}-#{parent_form}"]
                   else
                     form_group_lookup_mapping(parent_form)
                   end
      return nil if lookup_ids.blank?

      lookups ||= Lookup.where(unique_id: lookup_ids)
      lookup = lookups.find { |l| l.contains_form_group_id?(form_group_id) }

      return nil unless lookup.present?

      lookup.lookup_values_i18n.map do |k, v|
        { k => v.find { |t| t['id'] == form_group_id }&.[]('display_text') }
      end.inject(:merge)
    end

    def add_form_group(form_group_id, form_group_description, parent_form, module_name, opts={})
      return if parent_form.blank?
      lookup_ids = module_name.present? ? ["lookup-form-group-#{module_name.downcase}-#{parent_form}"] : form_group_lookup_mapping(parent_form)
      return if lookup_ids.blank?

      lookup_ids.each do |lkp_id|
        lookup = Lookup.find_by(unique_id: lkp_id)
        if lookup.present? && lookup.lookup_values_en.map{|v| v['id']}.exclude?(form_group_id)
          new_values = lookup.lookup_values_en + [{id: form_group_id, display_text: form_group_description}.with_indifferent_access]
          lookup.lookup_values_en = new_values
          lookup.save
        end
      end
    end

    def display_value(lookup_id, option_id, lookups = nil, opts={})
      opts[:locale] = I18n.locale
      Lookup.values(lookup_id, lookups, opts).find{|l| l["id"] == option_id}.try(:[], 'display_text')
    end

    def get_location_types
      find_by(unique_id: 'lookup-location-type')
    end
    # memoize_in_prod :get_location_types

    def import_translations(lookups_hash={}, locale)
      if locale.present? && Primero::Application::locales.include?(locale)
        lookups_hash.each do |key, value|
          if key.present?
            lookup = Lookup.find_by(unique_id: key)
            if lookup.present?
              lookup.update_translations(value, locale)
              Rails.logger.info "Updating Lookup translation: Lookup [#{lookup.id}] locale [#{locale}]"
              lookup.save!
            else
              Rails.logger.error "Error importing translations: Lookup for ID [#{key}] not found"
            end
          else
            Rails.logger.error "Error importing translations: Lookup ID not present"
          end
        end
      else
        Rails.logger.error "Error importing translations: locale not present"
      end
    end

    private

    def form_group_lookup_mapping(parent_form)
      lookup_ids = []
      case parent_form
      when 'case'
        lookup_ids = %w[lookup-form-group-cp-case lookup-form-group-gbv-case]
      when 'tracing_request'
        lookup_ids = %w[lookup-form-group-cp-tracing-request]
      when 'incident'
        lookup_ids = %w[lookup-form-group-cp-incident lookup-form-group-gbv-incident]
      end
      lookup_ids
    end
  end

  def contains_form_group_id?(form_group_id)
    lookup_values_i18n.values.flatten.find { |form_group| form_group['id'] == form_group_id }.present?
  end

  def localized_property_hash(locale = Primero::Application::BASE_LANGUAGE)
    lh = localized_hash(locale)
    lvh = {}

    self.lookup_values(locale).try(:each) {|lv| lvh[lv['id']] = lv['display_text']}
    lh['lookup_values'] = lvh
    lh
  end

  def sanitize_lookup_values
    self.lookup_values.reject!(&:blank?) if self.lookup_values
  end

  def validate_values_keys_match
    default_ids = self.lookup_values_en.try(:map){|lv| lv['id']}
    if default_ids.present?
      Primero::Application::locales.each do |locale|
        next if locale == Primero::Application::BASE_LANGUAGE || self.send("lookup_values_#{locale}").blank?
        locale_ids = self.send("lookup_values_#{locale}").try(:map){|lv| lv['id']}
        return errors.add(:lookup_values, I18n.t("errors.models.field.translated_options_do_not_match")) if ((default_ids - locale_ids).present? || (locale_ids - default_ids).present?)
      end
    end
    true
  end

  def clear_all_values
    Primero::Application::locales.each do |locale|
      self.send("lookup_values_#{locale}=", nil)
    end
  end

  def is_being_used?
    Field.where(option_strings_source: "lookup #{self.unique_id}").size.positive?
  end

  def valid?(context = :default)
    self.name = self.name.try(:titleize)
    sanitize_lookup_values
    super(context)
  end

  def generate_unique_id
    if self.name_en.present? && self.unique_id.blank?
      code = SecureRandom.uuid.to_s.last(7)
      self.unique_id = "lookup-#{self.name_en}-#{code}".parameterize.dasherize
    end
  end

  def check_is_being_used
    if self.is_being_used?
      errors.add(:name, I18n.t("errors.models.lookup.being_used"))
      throw(:abort)
    end
  end

  def update_translations(lookup_hash={}, locale)
    if locale.present? && Primero::Application::locales.include?(locale)
      lookup_hash.each do |key, value|
        if key == 'lookup_values'
          update_lookup_values_translations(value, locale)
        else
          self.send("#{key}_#{locale}=", value)
        end
      end
    else
      Rails.logger.error "Lookup translation not updated: Invalid locale [#{locale}]"
    end
  end

  def update_properties(lookup_properties)
    self.unique_id = lookup_properties[:unique_id] if lookup_properties[:unique_id].present?
    self.name_i18n = FieldI18nService.merge_i18n_properties(
      { name_i18n: self.name_i18n },
      { name_i18n: lookup_properties[:name] }
    )[:name_i18n]

    self.lookup_values_i18n = FieldI18nService.merge_i18n_options(
      self.lookup_values_i18n,
      lookup_properties[:values]
    )

    self.lookup_values_i18n.keys.each do |key|
      self.lookup_values_i18n[key] = self.lookup_values_i18n[key].reject{ |value| value['_delete'].present? }
    end

  end


  private

  def validate_name_in_english
    return true if self.name_en.present?
    errors.add(:name, I18n.t("errors.models.lookup.name_present"))
    return false
  end

  def generate_values_keys
    if self.lookup_values.present?
      self.lookup_values.each_with_index do |option, i|
        new_option_id = nil
        option_id_updated = false
        if option.is_a?(Hash)
          if option['id'].blank? && option['display_text'].present?
            #TODO - examine if this is proper
            #TODO - Using a random number at the end screws things up when exporting the lookup.yml to load into Transifex
            new_option_id = option['display_text'].parameterize.underscore + '_' + rand.to_s[2..6]
            option_id_updated = true
          elsif option['id'] == DEFAULT_UNKNOWN_ID_TO_NIL
            #TODO - seems to be causing trouble
            #TODO - remove  (No longer using in lookup seeds / config)
            new_option_id = nil
            option_id_updated = true
          end
        end
        if option_id_updated
          Primero::Application::locales.each{|locale|
            lv = self.send("lookup_values_#{locale}")
            lv[i]['id'] = new_option_id if lv.present?
          }
        end
      end
    end
  end

  def sync_lookup_values
    #Do not create any new lookup values that do not have a matching lookup value in the default language
    default_ids = self.send("lookup_values_en").try(:map){|lv| lv['id']}
    if default_ids.present?
      Primero::Application::locales.each do |locale|
        next if locale == Primero::Application::BASE_LANGUAGE
        self.send("lookup_values_#{locale}").try(:reject!){|lv| default_ids.exclude?(lv['id'])}
      end
    end
  end

  def update_lookup_values_translations(lookup_values_hash, locale)
    options = (self.send("lookup_values_#{locale}").present? ? self.send("lookup_values_#{locale}") : [])
    lookup_values_hash.each do |key, value|
      lookup_value = options.try(:find){|lv| lv['id'] == key}
      if lookup_value.present?
        lookup_value['display_text'] = value
      else
        options << {'id' => key, 'display_text' => value}
      end
    end
    self.send("lookup_values_#{locale}=", options)
  end
end
