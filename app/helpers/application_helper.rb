# frozen_string_literal: true

# Common controller helpers
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
    location_file = Dir.glob("#{GenerateLocationFilesService.options_parent_dir}/options/*").first
    return [] unless location_file.present?

    file = location_file.match(%r{(/options/.*.json)$})
    return [] unless file

    file[0].to_json.html_safe
  end

  def csp_property_meta_tag
    return unless content_security_policy?
    tag("meta", property: "csp-nonce", content: content_security_policy_nonce)
  end
end
