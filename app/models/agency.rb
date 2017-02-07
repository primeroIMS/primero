class Agency < CouchRest::Model::Base
  use_database :agency

  include PrimeroModel
  include Primero::CouchRestRailsBackward
  include LogoUploader
  include Memoizable
  include Namable
  include Disableable


  property :telephone
  property :logo
  property :order, Integer, default: 0
  property :logo_enabled, TrueClass, :default => false
  property :core_resource, TrueClass, :default => false
  property :agency_code

  #TODO: What are some other agency fields?

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

  class << self
    alias :old_all :all
    alias :by_all :all
    alias :list_by_all :all

    def all
      old_all
    end
    memoize_in_prod :all

    def available_agency_names
      self.list_by_enabled.collect{ |a| [ a.name, a.id ] }
    end
    memoize_in_prod :available_agency_names

    def retrieve_logo_ids
      self.by_order.select{|l| l.logo_enabled == true }
          .collect{ |a| { id: a.id, filename: a['logo_key'] } unless a['logo_key'].nil? }.flatten.compact
    end
    memoize_in_prod :retrieve_logo_ids
  end
end
