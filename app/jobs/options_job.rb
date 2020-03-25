class OptionsJob < ApplicationJob
  queue_as :options

  def perform
    dir = "#{Rails.root}/public/options"
    fingerprint = Digest::MD5.hexdigest Time.now.to_s

    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    FileUtils.rm_rf Dir.glob("#{dir}/*")

    Location.order(:location_code, :hierarchy_path).find_in_batches(batch_size: 500).each do |locations|
      location_options = locations.map do |location|
        {
          id: location.id,
          code: location.location_code,
          type: location.type,
          admin_level: location.admin_level
        }.merge(
          FieldI18nService.fill_keys([:name], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n)))
        )
      end

      File.open("#{dir}/locations-#{fingerprint}.json", 'a') do |f|
        f.write(location_options.to_json)
      end
    end
  end
end
