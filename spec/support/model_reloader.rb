module ModelReloader

  def reload_model(model)
    Object.send(:remove_const, model.name.to_sym)
    yield if block_given?
    #This is mostly for testing Child, TracingRequest, Incident anyway
    path = "#{Rails.root}/app/models/#{model.name.underscore}.rb"
    load path
  end

end