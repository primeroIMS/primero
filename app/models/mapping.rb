class Mapping < CouchRest::Model::Base
  use_database :mapping

  include PrimeroModel
  include Memoizable

  property :default_locale, String
  property :needs_codes_mapping

  before_save :initialize_needs_codes

  def initialize_needs_codes
    if needs_codes_mapping.nil?
      needs_codes_mapping = { "mapping" => nil, "autocalculate" => false }
    end
  end

#TODO: Access to needs_codes_mapping['from'] and ['to'] should be added here
# after this model is exposed in UI so that it will be possible to define mapping
# from within the UI by clicking through

  def needs_codes
    needs_codes_mapping['mapping']
  end

  def autocalculate_needs_codes?
    needs_codes_mapping['autocalculate']
  end

end
