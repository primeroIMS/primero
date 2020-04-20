class OptionsJob < ApplicationJob
  queue_as :options

  def perform
    dir = "#{Rails.root}/public/options"
    fingerprint = Digest::MD5.hexdigest Time.now.to_s

    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    FileUtils.rm_rf Dir.glob("#{dir}/*")

    @system_settings ||= SystemSettings.current
    reporting_location_admin_levels = @system_settings.reporting_location_admin_levels

    Primero::Application.locales.each do |locale|
      location_array = []
      locations = {
        type: 'Location',
        options: Location.all_names(locale: locale)
      }
      next if locations[:options].blank?

      location_array << locations

      reporting_location_admin_levels.each do |admin_level|
        reporting_locations = {
          type: "ReportingLocation#{admin_level}",
          options: Location.all_names_reporting_locations(locale: locale, system_settings: @system_settings,
                                                          reporting_location_admin_level: admin_level)
        }
        location_array << reporting_locations
      end

      File.open("#{dir}/options_#{locale}-#{fingerprint}.json", 'w+') do |f|
        f.write(location_array.to_json)
      end
    end
  end
end
