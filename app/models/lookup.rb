#TODO - add i18n
class Lookup < CouchRest::Model::Base
  use_database :lookup

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  property :description
  localize_properties [:name]
  localize_properties [:lookup_values], generate_keys: true

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

    def values(lookup_id, lookups = nil)
      if lookups.present?
        lookup = lookups.select {|lkp| lkp.id == lookup_id}.first
      else
        lookup = Lookup.get(lookup_id)
      end
      lookup.present? ? (lookup.lookup_values || []) : []
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
      self.lookup_values.each do |option|
        if option.is_a?(Hash) && option['id'].blank? && option['display_text'].present?
          option['id'] = option['display_text'].parameterize.underscore + '_' + rand.to_s[2..6]
        end
      end
    end
  end
end

