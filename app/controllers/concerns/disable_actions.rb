module DisableActions extend ActiveSupport::Concern
  def load_records_according_to_disable_filter
    # sort_option = params[:sort] || "full_name"
    filter_option = params[:filter] || "enabled"

    #TODO - Sorting... or should that be handled in models?

    @records = model_class.send("by_#{filter_option}").all

    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end
end