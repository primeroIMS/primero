module DisableActions extend ActiveSupport::Concern
  def load_records_according_to_disable_filter
    filter_option = params[:filter] || "enabled"

    case filter_option
      when "all"
        @records = model_class.all.all
      when "disabled"
        @records = model_class.by_disabled.all
      else
        @records = model_class.by_enabled.all
    end

    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end
end