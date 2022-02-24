# frozen_string_literal: true

# Contains all solr method utils
class SolrUtils
  # TODO: Any connection tests?

  # Taken from https://github.com/rsolr/rsolr/blob/v2.5.0/lib/rsolr.rb#L34
  SPECIAL_CHARACTERS_REGEX = %r(([+\-&|!\(\)\{\}\[\]\^"~\*\?:\\\/])).freeze

  # Return the raw Rsolr connection used by Sunspot
  def self.sunspot_rsolr
    Sunspot.session.session.rsolr_connection
  end

  # Retrieve the intenal Sunspot configuration for a model
  def self.sunspot_setup(model)
    clazz = model
    unless clazz.is_a? Class
      clazz = model == 'case' ? 'Child' : model.camelcase
      clazz = Kernel.const_get(clazz)
    end
    Sunspot::Setup.for(clazz)
  end

  # Return the indexed field name as Sunspot calculated it
  def self.indexed_field_name(model, name)
    field = sunspot_setup(model).field(name)
    field.indexed_name
  rescue Sunspot::UnrecognizedFieldError => e
    Rails.logger.warn e.message
    nil
  end

  def self.unescape(value)
    return value unless special_characters?(value)

    value.gsub(/\\/, '')
  end

  def self.special_characters?(value)
    value.match?(SPECIAL_CHARACTERS_REGEX)
  end
end
