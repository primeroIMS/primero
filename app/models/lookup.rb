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
  # validate :is_id_unique, :if => :id
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

    def lookup_id_from_name(name)
      code = UUIDTools::UUID.random_create.to_s.last(7)
      "lookup-#{name}-#{code}".parameterize.dasherize
    end
    memoize_in_prod :lookup_id_from_name

    def values(lookup_id, lookups = nil)
      if lookups.present?
        lookup = lookups.select {|lkp| lkp['_id'] == lookup_id}.first
      else
        lookup = Lookup.get(lookup_id)
      end
      lookup.present? ? lookup.lookup_values : []
    end
    memoize_in_prod :values
  end

  def sanitize_lookup_values
    self.lookup_values.reject! { |value| value.blank? } if self.lookup_values
  end

  def is_id_unique
    lookup = Lookup.get(id)
    return true if lookup.nil?
    # error message refers to name since that is what the user is inputting
    errors.add(:name, I18n.t("errors.models.lookup.unique_name"))
  end

  def validate_has_2_values
    return errors.add(:lookup_values, I18n.t("errors.models.field.has_2_options")) if (lookup_values == nil || lookup_values.length < 2 || lookup_values[0]['display_text'] == '' || lookup_values[1]['display_text'] == '')
    true
  end

  def is_being_used?
    FormSection.find_by_lookup_field(self.label).all.size > 0
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
    self["_id"] ||= Lookup.lookup_id_from_name self.name_en
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

