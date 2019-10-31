class Agency < CouchRest::Model::Base
  use_database :agency

  include PrimeroModel
  include Primero::CouchRestRailsBackward
  include LogoUploader
  include Memoizable
  include Disableable
  include LocalizableProperty

  DEFAULT_BASE_LANGUAGE = Primero::Application::LOCALE_ENGLISH
  #TODO - i18n name and description came from Nameable.  Need cleaner way to handle this
  localize_properties [:name, :description]
  property :telephone
  property :logo
  property :order, Integer, default: 0
  property :logo_enabled, TrueClass, :default => false
  property :core_resource, TrueClass, :default => false
  property :agency_code
  property :services, :type => [String]
  property :base_language, :default => DEFAULT_BASE_LANGUAGE

  design :by_order do
    view :by_order
  end

  #TODO: In v2 this will be replaced by a regular AR SQL where clause
  design :by_service do
    view :by_service,
         :map => "function(doc) {
           if (doc['couchrest-type'] == 'Agency' && doc['services']) {
             for (var i in doc['services']) {
               emit(doc['services'][i], null);
             }
           }
         }"
  end

  validates_presence_of :agency_code, :message => I18n.t("errors.models.agency.code_present")
  validate :validate_name_in_base_language

  before_create :generate_id

  class << self
    alias :old_all :all
    alias :by_all :all
    alias :list_by_all :all

    def all
      old_all
    end
    memoize_in_prod :all
    memoize_in_prod :list_by_all

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for Agency fields
    def all_names
      self.by_disabled(key: false).map{|r| {id: r.id, display_text: r.name}.with_indifferent_access}
    end

    def retrieve_logo_ids
      self.by_order.select{|l| l.logo_enabled == true }
          .collect{ |a| { id: a.id, filename: a['logo_key'] } unless a['logo_key'].nil? }.flatten.compact
    end
    memoize_in_prod :retrieve_logo_ids

    def display_text(agency_id, opts={})
      locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
      agency = Agency.get(agency_id)
      value = (agency.present? ? agency.name(locale) : '')
    end
    memoize_in_prod :display_text

    def list_by_service_enabled(service)
      return self.list_by_enabled if service.blank?
      (self.by_service(key: service).all || []).select{|a| a.disabled == false}
    end
  end

  def generate_id
    #Use agency_code to generate the ID since it is more stable than the name
    self["_id"] ||= "agency-#{self.agency_code}".parameterize.dasherize
  end

  def validate_name_in_base_language
    return true if self.send("name_#{DEFAULT_BASE_LANGUAGE}").present?
    errors.add(:name, I18n.t("errors.models.agency.name_present"))
    return false
  end
end
