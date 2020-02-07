Minipack.configuration do |c|
  c.cache = !Rails.env.development?

  c.base_path = Rails.root.join("app", "javascript")

  ["application", "identity"].each do |m|
    c.add m.to_sym do |a|
      a.manifest = if Rails.env.development?
        "http://localhost:9000/#{m}.json"
      else
        Rails.root.join('public', 'manifest', "#{m}.json")
      end  
    end
  end

  c.build_cache_key << 'app/javascript/**/*'
end