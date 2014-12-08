class SolrUtils

  #TODO: Any connection tests?

  # Return the raw Rsolr connection used by Sunspot
  def self.sunspot_rsolr
    Sunspot.session.session.rsolr_connection
  end

  # Retrieve the intenal Sunspot configuration for a model
  def self.sunspot_setup(model)
    clazz = model
    unless clazz.is_a? Class
      clazz = (model == 'case') ? 'Child' : model.camel_case
      clazz = eval(clazz)
    end
    Sunspot::Setup.for(clazz)
  end

  # Return the indexed field name as Sunspot calculated it
  def self.indexed_field_name(model, name)
    field = sunspot_setup(model).field(name)
    field.indexed_name
  end


end