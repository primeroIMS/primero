# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.short_name @theme&.site_title || 'Primero'
json.name @theme&.site_title || 'Primero'
json.description @theme&.site_description || 'Primero is an open source software platform that helps social services,
humanitarian and development workers manage protection-related data, with tools that facilitate case management,
incident monitoring and family tracing and reunification.'
json.start_url 'v2/'
json.background_color '#ffffff'
json.display 'standalone'
json.theme_color @theme.present? ? @theme.colors['manifestThemeColor'] : '#0093ba'
json.icons do
  Theme::PICTORIAL_SIZES.each do |size|
    img_src = if @theme.present?
                rails_blob_path(@theme.send("logo_pictorial_#{size}".to_sym), only_path: true)
              else
                "/primero-pictorial-#{size}.png"
              end

    json.child! do
      json.src img_src
      json.type 'image/png'
      json.sizes "#{size}x#{size}"
    end
  end
end
