class GenerateLocationFilesService
  class << self
    def generate
      create_directory
      write_files
    end

    private

    def output_dir
      dir_path = "#{Rails.root}/public/options"
      { root: dir_path, locationsFile: "#{dir_path}/locations.json"}
    end

    def fingerprint
      file = File.open(output_dir[:locationsFile])
      Digest::MD5.hexdigest file.read
    end

    def create_directory
      FileUtils.mkdir_p(output_dir[:root]) unless File.directory?(output_dir[:root])
      FileUtils.rm_rf Dir.glob("#{output_dir[:root]}/*")
    end

    def rename_output 
      File.rename(output_dir[:locationsFile], "#{output_dir[:root]}/locations-#{fingerprint}.json")
      copy_to_production_dir
    end

    def copy_to_production_dir
      app_share_dir = ENV['APP_SHARE_DIR']

      if Rails.env.production? && app_share_dir.present?
        FileUtils.cp(output_dir[:locationsFile], "#{app_share_dir}/options")
      end
    end

    def write_files
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
  
        File.open(output_dir[:locationsFile], 'a') do |f|
          f.write(location_options.to_json)
        end
      end

      rename_output
    end
  end
end
