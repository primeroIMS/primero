require 'addressable/uri'

class PrimeroURI < Addressable::URI
  def as_couch_json
    to_s
  end
end

