namespace :i18n do
  namespace :js do
    desc "Export translations to JS file(s)"
    task :export => :environment do
      Dir.glob(Rails.root.join('public', 'translations-*.js')).each { |file| File.delete(file)}

      I18n::JS.export

      manifest_file = Rails.root.join('tmp', 'i18n-manifest.txt')
      translations_file = Rails.root.join('public', 'translations.js')
      md5 = Digest::MD5.file(translations_file)
      translations_file_fingerprinted = "translations-#{md5}.js"

      File.rename(translations_file, Rails.root.join('public', translations_file_fingerprinted))
      File.write(manifest_file, translations_file_fingerprinted)
    end
  end
end
