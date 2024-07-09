# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Monkey patch Minipack
Minipack::Manifest.class_eval do
  def lookup_pack_with_chunks!(name, type: nil)
    manifest_pack_type = manifest_type(name, type)
    manifest_pack_name = manifest_name(name, manifest_pack_type)

    paths = data['entrypoints']&.dig(manifest_pack_name, manifest_pack_type) ||
            data['entrypoints']&.dig(manifest_pack_name, 'assets', manifest_pack_type) ||
            handle_missing_entry(name)

    entries = paths.map do |source|
      entry_from_source(source) || handle_missing_entry(name)
    end

    Minipack::Manifest::ChunkGroup.new(entries)
  end
end

Minipack.configuration do |minipack|
  minipack.cache = !Rails.env.development?
  minipack.base_path = Rails.root.join('app', 'javascript')
  minipack.add(:application) do |a|
    manifest_root = Rails.env.development? ? 'http://localhost:9000' : Rails.root.join('public', 'manifests')
    a.manifest = "#{manifest_root}/application.json"
  end
  minipack.build_cache_key << 'app/javascript/**/*'
end
