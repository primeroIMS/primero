# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.short_name @theme&.site_title
json.name @theme&.site_title
json.description @theme&.site_description
json.start_url 'v2/'
json.background_color '#ffffff'
json.display 'standalone'
json.theme_color @theme&.colors&.[]('manifestThemeColor')
json.icons do
  Theme::PICTORIAL_SIZES.each do |size|
    logo = @theme.send(:"logo_pictorial_#{size}")
    img_src = if logo.present?
                rails_blob_path(logo, only_path: true)
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
