class Agency < CouchRest::Model::Base
  use_database :agency

  include PrimeroModel
  include RapidFTR::CouchRestRailsBackward
  include LogoUploader
  include Namable


  property :telephone
  property :logo
  property :order, Integer
  #TODO: What are some other agency fields?

  design do
    view :by_order
  end

  def self.retrieve_logo_ids
    self.by_order.collect{ |a| {id: a.id, filename: a['logo_key']} }.flatten.compact
  end
end
