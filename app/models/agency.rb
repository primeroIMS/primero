class Agency < CouchRest::Model::Base
  use_database :agency

  include PrimeroModel
  include Primero::CouchRestRailsBackward
  include LogoUploader
  include Memoizable
  include Disableable
  include LocalizableProperty

  #TODO - i18n name and description came from Nameable.  Need cleaner way to handle this
  localize_properties [:name, :description]
  property :telephone
  property :logo
  property :order, Integer, default: 0
  property :logo_enabled, TrueClass, :default => false
  property :core_resource, TrueClass, :default => false
  property :agency_code

  design do
    view :by_order

    view :by_id,
         :map => "function(doc) {
                    if (doc['couchrest-type'] == 'Agency')
                   {
                      emit(doc['_id'], null);
                   }
                }"
  end
  
  validates_presence_of :agency_code, :message => I18n.t("errors.models.agency.code_present")
  validates_presence_of :name, :message => I18n.t("errors.models.agency.name_present")

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
    memoize_in_prod :all_names

    def retrieve_logo_ids
      self.by_order.select{|l| l.logo_enabled == true }
          .collect{ |a| { id: a.id, filename: a['logo_key'] } unless a['logo_key'].nil? }.flatten.compact
    end
    memoize_in_prod :retrieve_logo_ids

    def display_text(agency_id)
      agency = Agency.get(agency_id)
      value = (agency.present? ? agency.name : '')
    end
    memoize_in_prod :display_text
  end

  def generate_id
    #Use agency_code to generate the ID since it is more stable than the name
    self["_id"] ||= "agency-#{self.agency_code}".parameterize.dasherize
  end
end
