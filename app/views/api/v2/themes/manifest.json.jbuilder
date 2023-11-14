json.short_name @theme&.site_title || 'Primero'
json.name @theme&.site_title || 'Primero'
json.description @theme&.site_description || 'Primero is an open source software platform that helps social services, humanitarian and development workers manage protection-related data, with tools that facilitate case management, incident monitoring and family tracing and reunification.'
json.start_url 'v2/'
json.background_color '#ffffff'
json.display 'standalone'
json.theme_color '#0093ba'
json.icons do
  json.child! do
    json.src @theme.present? ? rails_blob_path(@theme.logo_pictorial_144, only_path: true) : '/primero-pictorial-144.png'
    json.type 'image/png'
    json.sizes '144x144'
  end
  json.child! do
    json.src @theme.present? ? rails_blob_path(@theme.logo_pictorial_192, only_path: true) : '/primero-pictorial-192.png'
    json.type 'image/png'
    json.sizes '192x192'
  end
  json.child! do
    json.src @theme.present? ? rails_blob_path(@theme.logo_pictorial_256, only_path: true) : '/primero-pictorial-512.png'
    json.type 'image/png'
    json.sizes '256x256'
  end
end
