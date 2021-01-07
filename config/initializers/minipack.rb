# frozen_string_literal: true

Minipack.configuration do |minipack|
  minipack.cache = !Rails.env.development?
  minipack.base_path = Rails.root.join('app', 'javascript')
  %w[application identity].each do |manifest|
    minipack.add(manifest.to_sym) do |a|
      manifest_root = Rails.env.development? ? 'http://localhost:9000' : Rails.root.join('public', 'manifests')
      a.manifest = "#{manifest_root}/#{manifest}.json"
    end
  end
  minipack.build_cache_key << 'app/javascript/**/*'
end
