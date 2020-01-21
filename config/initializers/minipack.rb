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