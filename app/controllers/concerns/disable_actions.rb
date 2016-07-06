module DisableActions extend ActiveSupport::Concern
  def load_records_according_to_disable_filter
    sort_option = params[:sort]
    filter_option = params[:filter] || "enabled"

    @records = sort_option.present? ? model_class.send("by_#{sort_option}_#{filter_option}").all :
                                      model_class.send("by_#{filter_option}").all

    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end
end