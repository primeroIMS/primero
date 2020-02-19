module ApplicationHelper

  def url_for_v2(model_object)
    "#{root_url}v2/#{resource_for_v2(model_object)}/#{model_object.id}"
  end

  def resource_for_v2(model_object)
    model = model_object.class
    if model.respond_to?(:parent_form)
      model.parent_form.underscore.pluralize
    else
      model.name.underscore.pluralize
    end
  end

  def host_url
    Rails.application.routes.default_url_options[:host]
  end

  def available_locations
    locationFile = Dir.glob("public/options/*").first

    return [] unless locationFile.present?

    locationFile.gsub(/public/, '').to_json.html_safe
  end
end
