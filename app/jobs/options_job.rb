class OptionsJob < ApplicationJob
  queue_as :options

  def perform
    dir = "#{Rails.root}/public/options"
    fingerprint = Digest::MD5.hexdigest Time.now.to_s

    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    FileUtils.rm_rf Dir.glob("#{dir}/*")

    Primero::Application.locales.each do |locale|
      locations = {
        type: 'Location',
        options: Location.all_names(locale: locale)
      }

      reporting_locations = {
        type: 'Reporting_Location',
        options: Location.all_names_reporting_locations(locale: locale)
      }

      next unless locations[:options].present?

      File.open("#{dir}/options_#{locale}-#{fingerprint}.json", 'w+') do |f|
        f.write([locations, reporting_locations].to_json)
      end
    end
  end
end
