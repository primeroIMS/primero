class GenerateLocationFilesService
  APP_SHARE_DIR = ENV['APP_SHARE_DIR']

  class << self
    def generate
      create_directory
      write_files
    end

    def parent_dir
      Rails.env.production? && APP_SHARE_DIR.present? ? APP_SHARE_DIR : "#{Rails.root}/public"
    end

    private

    def output_dir
      "#{parent_dir}/options"
    end

    def locations
      Location.all.map { |location| {
          id: location.id,
          code: location.location_code,
          type: location.type
      }.merge(FieldI18nService.fill_keys([:name], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n)))) }
    end

    def fingerprint
      Digest::MD5.hexdigest Time.now.to_s
    end

    def create_directory
      FileUtils.mkdir_p(output_dir) unless File.directory?(output_dir)
      FileUtils.rm_rf Dir.glob("#{output_dir}/*")
    end

    def write_files
      File.open("#{output_dir}/locations-#{fingerprint}.json", 'w+') do |f|
        f.write(locations.to_json)
      end
    end
  end
end