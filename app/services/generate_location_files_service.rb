# frozen_string_literal: true

# Generates a JSON file of all Location objects.
# Often, this will be too big to be served via the API.
class GenerateLocationFilesService
  class << self
    def generate
      create_directory
      write_files
    end

    def options_parent_dir
      use_app_share_dir? ? ENV['APP_SHARE_DIR'] : public_dir
    end

    private

    def public_dir
      "#{Rails.root}/public"
    end

    def app_share_dir
      ENV['APP_SHARE_DIR']
    end

    def use_app_share_dir?
      Rails.env.production? && app_share_dir.present?
    end

    def output_dir
      dir_path = "#{public_dir}/options"
      { root: dir_path, locations_file: "#{dir_path}/locations.json"}
    end

    def fingerprint
      file = File.open(output_dir[:locations_file])
      Digest::MD5.hexdigest file.read
    end

    def create_directory
      FileUtils.mkdir_p(output_dir[:root]) unless File.directory?(output_dir[:root])
      FileUtils.rm_rf Dir.glob("#{output_dir[:root]}/*")
      FileUtils.rm_rf Dir.glob("#{app_share_dir}/options/*") if use_app_share_dir?
    end

    def format_for_output(location)
      {
        id: location.id,
        code: location.location_code,
        type: location.type,
        admin_level: location.admin_level
      }.merge(
        FieldI18nService.fill_keys([:name], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n)))
      )
    end

    def write_locations_to_file
      Location.order(:location_code, :hierarchy_path).find_in_batches(batch_size: 500).each do |locations|
        location_options = locations.map { |location| format_for_output(location) }
        File.open(output_dir[:locations_file], 'a') do |f|
          f.write(location_options.to_json)
        end
      end
    end

    def write_empty_file
      File.open(output_dir[:locations_file], 'a') do |f|
        f.write([].to_json)
      end
    end

    def write_files
      if Location.count.positive?
        write_locations_to_file
      else
        write_empty_file
      end
      file = rename_output
      copy_to_production_dir
      file
    end

    def rename_output
      renamed_file = "#{output_dir[:root]}/locations-#{fingerprint}.json"
      File.rename(output_dir[:locations_file], renamed_file)
      renamed_file
    end

    def copy_to_production_dir
      return unless use_app_share_dir?

      FileUtils.cp_r("#{output_dir[:root]}/.", "#{app_share_dir}/options")
    end
  end
end
