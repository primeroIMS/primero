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
    view :by_name,
            :map => "function(doc) {
                if ((doc['couchrest-type'] == 'Lookup') && doc['name']) {
                  emit(doc['name'], null);
                }
            }"
  end

  validates_presence_of :name, :message => "Name must not be blank"
  validate :is_name_unique, :if => :name
  validate :validate_has_2_values

  before_validation :generate_values_keys
  before_save :generate_id
  before_destroy :check_is_being_used

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all


    def find_by_name(name)
      Lookup.by_name(:key => name).first
    end
    memoize_in_prod :find_by_name

    def lookup_id_from_name(name)
      "lookup-#{name}".parameterize.dasherize
    end
    memoize_in_prod :lookup_id_from_name

    def values(name, lookups = nil)
      if lookups.present?
        lookup = lookups.select {|lkp| lkp['name'] == name}.first
      else
        lookup = self.find_by_name(name)
      end
      lookup.present? ? lookup.lookup_values : []
    end
    memoize_in_prod :values
  end

  def sanitize_lookup_values
    self.lookup_values.reject! { |value| value.blank? } if self.lookup_values
  end

  def is_name_unique
    lookup = Lookup.find_by_name(name)
    return true if lookup.nil? or self.id == lookup.id
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
    self["_id"] ||= Lookup.lookup_id_from_name self.name
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

