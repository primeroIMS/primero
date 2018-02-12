#TODO - add i18n
class Lookup < CouchRest::Model::Base
  use_database :lookup

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  property :locked, TrueClass, :default => false
  localize_properties [:name]
  localize_properties [:lookup_values], generate_keys: true
  property :base_language, :default=>Primero::Application::LOCALE_ENGLISH

  #TODO - seems to be causing trouble
  #TODO - remove  (No longer using in lookup seeds / config)
  DEFAULT_UNKNOWN_ID_TO_NIL = 'default_convert_unknown_id_to_nil'

  design do
    view :all
  end

  validates_presence_of :name, :message => "Name must not be blank"
  validate :validate_has_2_values
  validate :validate_values_keys_match

  before_validation :generate_values_keys
  before_validation :sync_lookup_values
  before_create :generate_id
  before_destroy :check_is_being_used

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all

    def values(lookup_id, lookups = nil, opts={})
      locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
      if lookups.present?
        lookup = lookups.select {|lkp| lkp.id == lookup_id}.first
      else
        lookup = Lookup.get(lookup_id)
      end
      lookup.present? ? (lookup.lookup_values(locale) || []) : []
    end
    memoize_in_prod :values

    def values_for_select(lookup_id, lookups = nil, opts={})
      opts[:locale] = I18n.locale
      self.values(lookup_id, lookups, opts).map{|option| [option['display_text'], option['id']]}
    end

    def display_value(lookup_id, option_id, lookups = nil, opts={})
      opts[:locale] = I18n.locale
      self.values(lookup_id, lookups, opts).select{|l| l["id"] == option_id}.first.try(:[], 'display_text')
    end

    def get_location_types
      self.get('lookup-location-type')
    end
    memoize_in_prod :get_location_types

    def import_translations(lookups_hash={}, locale)
      if locale.present? && Primero::Application::locales.include?(locale)
        lookups_hash.each do |key, value|
          if key.present?
            lookup = self.get(key)
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
  end

  def localized_property_hash(locale=FormSection::DEFAULT_BASE_LANGUAGE)
    lh = localized_hash(locale)
    lvh = {}
    self["lookup_values_#{locale}"].try(:each) {|lv| lvh[lv['id']] = lv['display_text']}
    lh['lookup_values'] = lvh
    lh
  end

  def sanitize_lookup_values
    self.lookup_values.reject! { |value| value.blank? } if self.lookup_values
  end

  def validate_has_2_values
    return errors.add(:lookup_values, I18n.t("errors.models.field.has_2_options")) if (lookup_values == nil || lookup_values.length < 2 || lookup_values[0]['display_text'] == '' || lookup_values[1]['display_text'] == '')
    true
  end

  def validate_values_keys_match
    default_ids = self.send("lookup_values_#{base_language}").try(:map){|lv| lv['id']}
    if default_ids.present?
      Primero::Application::locales.each do |locale|
        next if locale == base_language || self.send("lookup_values_#{locale}").blank?
        locale_ids = self.send("lookup_values_#{locale}").try(:map){|lv| lv['id']}
        return errors.add(:lookup_values, I18n.t("errors.models.field.translated_options_do_not_match")) if locale_ids != default_ids
      end
    end
    true
  end

  def is_being_used?
    FormSection.find_by_lookup_field(self.id).all.size > 0
  end

  def label
    self.name.gsub(' ', '')
  end

  def valid?(context = :default)
    self.name = self.name.try(:titleize)
    sanitize_lookup_values
    super(context)
  end

  def generate_id
    code = UUIDTools::UUID.random_create.to_s.last(7)
    self.id ||= "lookup-#{self.name}-#{code}".parameterize.dasherize
  end

  def check_is_being_used
    if self.is_being_used?
      errors.add(:name, I18n.t("errors.models.lookup.being_used"))
      throw(:abort)
    end
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
    default_ids = self.send("lookup_values_#{base_language}").try(:map){|lv| lv['id']}
    if default_ids.present?
      Primero::Application::locales.each do |locale|
        next if locale == base_language
        self.send("lookup_values_#{locale}").try(:reject!){|lv| default_ids.exclude?(lv['id'])}
      end
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

  private

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

