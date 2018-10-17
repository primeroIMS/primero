# frozen_string_literal: true

class OptionsJob < ApplicationJob
  queue_as :options

  def perform
    dir = "#{Rails.root}/public/options"
    fingerprint = Digest::MD5.hexdigest Time.now.to_s

    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    FileUtils.rm_rf Dir.glob("#{dir}/*")

    # TODO: Check with ron if this is what to use locales.enabled vs this
    Primero::Application.locales.each do |locale|
      locations = {
        type: 'Location',
        options: Location.all_names(locale: locale)
      }

      next unless locations[:options].present?

      File.open("#{dir}/options_#{locale}-#{fingerprint}.json", 'w+') do |f|
        f.write(locations.to_json)
      end
    end
  end
end
