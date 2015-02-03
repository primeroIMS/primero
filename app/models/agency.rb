class Agency < CouchRest::Model::Base
  use_database :agency

  include PrimeroModel
  include RapidFTR::CouchRestRailsBackward
  include LogoUploader
  include Memoizable
  include Namable


  property :telephone
  property :logo
  property :order, Integer, default: 0
  property :logo_enabled, TrueClass, :default => false

  #TODO: What are some other agency fields?

  design do
    view :by_order
  end

  class << self
    alias :old_all :all

    def all
      old_all
    end
    memoize_in_prod :all

    def available_agency_names
      self.all.all.collect{ |a| [ a.name, a.id ] }
    end
    memoize_in_prod :available_agency_names

    def retrieve_logo_ids
      self.by_order.select{|l| l.logo_enabled == true }
          .collect{ |a| { id: a.id, filename: a['logo_key'] } unless a['logo_key'].nil? }.flatten.compact
    end
    memoize_in_prod :retrieve_logo_ids
  end
end
