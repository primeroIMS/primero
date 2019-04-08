module DisableActions extend ActiveSupport::Concern
  def load_records_according_to_disable_filter
    sort_option = sort_option_from_params
    filter_option = params[:filter] || "enabled"

    @records = sort_option.present? ? model_class.send("by_#{sort_option}_#{filter_option}") :
                                      model_class.send("list_by_#{filter_option}")

    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end

  private

  def sort_option_from_params
    params[:sort] || (model_class.respond_to?(:default_sort_field) ? model_class.default_sort_field : nil)
  end
end