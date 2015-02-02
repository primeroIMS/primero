class CouchChangesController < ActionController::Base
  extend Memoist

  # Models listening for changes should do things in the observer callback
  # that affect only itself and nothing externally.  Use the couch change
  # watcher processors for making changes to external services.
  def notify
    begin
      modelClasses = (params[:models_changed] || []).map {|mname| model_from_name(mname) }

      if modelClasses.length > 0
        modelClasses.each do |modelCls|
          modelCls.changed
          modelCls.notify_observers()
        end
      end
      render :json => 'ok'
    rescue InvalidModelName => e
      render :json => {:error => "Model not found: #{e}"}, :status => 404
    end
  end

  private

  class InvalidModelName < StandardError
  end

  def model_from_name name
    cls = CouchRest::Model::Base.descendants.find {|cls| cls.name == name }
    if cls.nil?
      raise InvalidModelName, name
    end

    cls
  end
  memoize :model_from_name
end
