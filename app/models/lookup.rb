# frozen_string_literal: true

# Model for Lookup
class Lookup < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  LOOKUP_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'unique_id' => { 'type' => 'string' },
    'name' => { 'type' => 'object' }, 'values' => { 'type' => 'array' }
  }.freeze

  localize_properties :name
  localize_properties :lookup_values, options_list: true
  self.unique_id_from_attribute = 'name_en'

  validate :validate_name_in_english
  validate :validate_options_have_default_locale
  validate :validate_values_id

  before_create :generate_unique_id
  before_destroy :check_is_being_used

  class << self
    def list(options)
      OrderByPropertyService.apply_order(all, options)
    end

    # TODO: Delete after we have fixed data storage with Alberto's changes.
    def new_with_properties(lookup_properties)
      Lookup.new(
        id: lookup_properties[:id],
        unique_id: lookup_properties[:unique_id],
        name_i18n: lookup_properties[:name],
        lookup_values_i18n: lookup_properties[:values]
      )
    end

    def values(lookup_unique_id, lookups = nil, opts = {})
      locale = opts[:locale].presence || I18n.locale
      lookup = if lookups.present?
                 lookups.find { |lkp| lkp.unique_id == lookup_unique_id }
               else
                 Lookup.find_by(unique_id: lookup_unique_id)
               end
      lookup.present? ? (lookup.lookup_values(locale) || []) : []
    end

    def values_for_select(lookup_id, lookups = nil, opts = {})
      opts[:locale] = I18n.locale
      values(lookup_id, lookups, opts).map { |option| [option['display_text'], option['id']] }
    end

    # TODO: This method will go away after UIUX refactor
    # TODO: Pavel review, I want to get rid of this.
    def form_group_name(form_group_id, parent_form, module_name, opts = {})
      form_group_names = form_group_name_all(form_group_id, parent_form, module_name)
      return nil if form_group_names.blank?

      locale = opts[:locale].presence || I18n.locale
      form_group_names[locale.to_s]
    end

    # This replaces form_group_name above
    def form_group_name_all(form_group_id, parent_form, module_name, lookups = nil)
      lookup_ids = if module_name.present?
                     ["lookup-form-group-#{module_name.downcase}-#{parent_form}"]
                   else
                     form_group_lookup_mapping(parent_form)
                   end
      return nil if lookup_ids.blank?

      lookups ||= Lookup.where(unique_id: lookup_ids)
      lookup = lookups.find { |l| l.contains_option_id?(form_group_id) }

      return nil unless lookup.present?

      FieldI18nService.fill_names(lookup.lookup_values_i18n.select { |v| v['id'] == form_group_id })
    end

    def add_form_group(form_group_id, form_group_description, parent_form, module_name)
      return if parent_form.blank?

      lookup_ids = if module_name.present?
                     ["lookup-form-group-#{module_name.downcase}-#{parent_form}"]
                   else
                     form_group_lookup_mapping(parent_form)
                   end
      return if lookup_ids.blank?

      updating_lookups(form_group_id, form_group_description, lookup_ids)
    end

    def updating_lookups(form_group_id, form_group_description, lookup_ids)
      lookup_ids.each do |lkp_id|
        lookup = Lookup.find_by(unique_id: lkp_id)
        next unless lookup.present? && lookup.lookup_values_en.map { |v| v['id'] }.exclude?(form_group_id)

        new_values =
          lookup.lookup_values_en +
          [{ id: form_group_id, display_text: form_group_description }.with_indifferent_access]
        lookup.lookup_values_en = new_values
        lookup.save
      end
    end

    def display_value(lookup_id, option_id, lookups = nil, opts = {})
      opts[:locale] ||= I18n.locale
      Lookup.values(lookup_id, lookups, opts).find { |l| l['id'] == option_id }&.[]('display_text')
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

  def contains_option_id?(option_id)
    lookup_values_i18n.any? { |value| value.dig('id') == option_id }
  end

  def validate_options_have_default_locale
    return if lookup_values_i18n.blank? || lookup_values_en.all? { |h| h['display_text'].present? }

    errors.add(:lookup_values, I18n.t('errors.models.lookup.default_options_blank'))
  end

  def validate_values_id
    return if lookup_values_i18n.blank? || lookup_values_i18n.all? { |h| h['id'].present? }

    errors.add(:lookup_values, I18n.t('errors.models.lookup.values_ids_blank'))
  end

  def being_used?
    Field.where(option_strings_source: "lookup #{unique_id}").size.positive?
  end

  def check_is_being_used
    return unless being_used?

    errors.add(:name, I18n.t('errors.models.lookup.being_used'))
    throw(:abort)
  end

  def update_translations(locale, lookup_hash = {})
    return Rails.logger.error('Lookup translation not updated: No Locale passed in') if locale.blank?

    invalid_locale = I18n.available_locales.exclude?(locale)
    return Rails.logger.error("Lookup translation not updated: Invalid locale [#{locale}]") if invalid_locale

    lookup_hash.each do |key, value|
      if key == 'lookup_values'
        update_lookup_values_translations(value, locale)
      else
        send("#{key}_#{locale}=", value)
      end
    end
  end

  def update_properties(lookup_properties)
    lookup_properties = lookup_properties.with_indifferent_access if lookup_properties.is_a?(Hash)
    self.name_i18n = FieldI18nService.merge_i18n_properties(
      { name_i18n: name_i18n },
      name_i18n: lookup_properties[:name]
    )[:name_i18n]
    self.attributes = lookup_properties.except(:name, :values)

    self.lookup_values_i18n = merge_options(
      lookup_values_i18n,
      lookup_properties[:values]
    )
  end

  def enabled_values(locale)
    values = lookup_values(locale)

    return [] if values.blank?

    values.filter { |lookup| !lookup['disabled'] }
  end

  private

  def validate_name_in_english
    return true if name_en.present?

    errors.add(:name, I18n.t('errors.models.lookup.name_present'))
    false
  end

  def send_update_lookup_options(lookup_values_hash, locale, default_ids, options)
    lookup_values_hash.each do |key, value|
      # Do not add a translation for an option that does not exist in the default locale
      next if default_ids.exclude?(key)

      lookup_value = options&.find { |lv| lv['id'] == key }
      if lookup_value.present?
        lookup_value['display_text'] = value
      else
        options << { 'id' => key, 'display_text' => value }
      end
    end
    send("lookup_values_#{locale}=", options)
  end

  def update_lookup_values_translations(lookup_values_hash, locale)
    default_ids = lookup_values_en&.map { |lv| lv['id'] }
    options = (send("lookup_values_#{locale}").present? ? send("lookup_values_#{locale}") : [])
    send_update_lookup_options(lookup_values_hash, locale, default_ids, options)
  end
end
