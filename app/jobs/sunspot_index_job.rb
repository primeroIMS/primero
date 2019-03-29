class SunspotIndexJob < ApplicationJob
  queue_as :sunspot

  def perform(indexable_model_class, indexable_model_id)
    indexable_model = indexable_model_class.constantize
    object = indexable_model.find(indexable_model_id)
    if object.present?
      object.index_for_search
    end
  end

end
