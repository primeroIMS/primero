class OptionsJob < ApplicationJob
  queue_as :options

  def perform
    dir = "#{Rails.root}/public/options"
    fingerprint = Digest::MD5.hexdigest Time.now.to_s

    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    FileUtils.rm_rf Dir.glob("#{dir}/*")

    locations = Location.all.map{ |location| {
      id: location.id,
      code: location.location_code,
      type: location.type,
      admin_level: location.admin_level
    }.merge(FieldI18nService.fill_keys([:name], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n))))} 

    File.open("#{dir}/locations-#{fingerprint}.json", 'w+') do |f|
      f.write(locations.to_json)
    end
  end
end
