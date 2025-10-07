# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    system_settings = SystemSettings.first
    return '' unless system_settings.location_file.attached?

    rails_blob_path(system_settings.location_file, only_path: true)
  end

  def csp_property_meta_tag
    return unless content_security_policy?

    tag('meta', property: 'csp-nonce', content: content_security_policy_nonce)
  end

  def url_for_asset(source)
    protocol = Rails.application.config.force_ssl ? 'https' : 'http'
    asset_path(source, host: host_url, protocol:)
  end
end
