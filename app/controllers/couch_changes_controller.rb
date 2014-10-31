class CouchChangesController < ActionController::Base
  extend Memoist

  # Models listening for changes should do things in the observer callback
  # that affect only itself and nothing externally.  Use the couch change
  # watcher processors for making changes to external services.
  def notify
    modelCls = model_from_name(params[:model_name])
    if modelCls.present?
      modelCls.changed
      modelCls.notify_observers(params[:id], params[:deleted] == 'true')
      render :json => 'ok'
    else
      render :json => {:error => 'Model not found'}, :status => 404
    end
  end

  private

  def model_from_name name
    CouchRest::Model::Base.descendants.find {|cls| cls.name == name }
  end
  memoize :model_from_name
end
