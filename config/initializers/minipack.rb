Minipack.configuration do |c|
  c.cache = !Rails.env.development?

  c.base_path = Rails.root.join("app", "javascript")

  c.manifest = if Rails.env.development?
    'http://localhost:9000/manifest.json'
  else
    Rails.root.join('public', 'packs', 'manifest.json')
  end

  c.build_cache_key << 'app/javascript/**/*'
end


# module Minipack::Helper
#   def javascript_bundles_with_chunks_tag(*names, manifest: nil, **options)
#     binding.pry
#     javascript_include_tag(*sources_from_manifest_entrypoints(names, 'js', key: manifest), **options)
#   end
# end
