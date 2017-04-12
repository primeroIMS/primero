#TODO - add i18n
class Lookup < CouchRest::Model::Base
  use_database :lookup

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  property :locked, TrueClass, :default => false
  localize_properties [:name]
  localize_properties [:lookup_values], generate_keys: true

  DEFAULT_UNKNOWN_ID_TO_NIL = 'default_convert_unknown_id_to_nil'

  design do
    view :all
  end

  validates_presence_of :name, :message => "Name must not be blank"
  validate :validate_has_2_values

  before_validation :generate_values_keys
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
      locale = if opts[:locale].present?
        opts[:locale]
      else
        [I18n.locale]
      end
      if lookups.present?
        lookup = lookups.select {|lkp| lkp.id == lookup_id}.first
      else
        lookup = Lookup.get(lookup_id)
      end
      lookup.present? ? lookup.values_for_locales(lookup, locale) : []
    end
    memoize_in_prod :values

    def get_location_types
      self.get('lookup-location-type')
    end
    memoize_in_prod :get_location_types
  end

  def sanitize_lookup_values
    self.lookup_values.reject! { |value| value.blank? } if self.lookup_values
  end

  def validate_has_2_values
    return errors.add(:lookup_values, I18n.t("errors.models.field.has_2_options")) if (lookup_values == nil || lookup_values.length < 2 || lookup_values[0]['display_text'] == '' || lookup_values[1]['display_text'] == '')
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
      return false
    end
  end

  def generate_values_keys
    if self.lookup_values.present?
      self.lookup_values.each_with_index do |option, i|
        new_option_id = nil
        option_id_updated = false
        if option.is_a?(Hash)
          if option['id'].blank? && option['display_text'].present?
            new_option_id = option['display_text'].parameterize.underscore + '_' + rand.to_s[2..6]
            option_id_updated = true
          elsif option['id'] == DEFAULT_UNKNOWN_ID_TO_NIL
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

  def values_for_locales(lookup, locales)
    values_hash = {}
    return locales.map { |locale| (lookup.lookup_values(locale) || []) }
  end
end

