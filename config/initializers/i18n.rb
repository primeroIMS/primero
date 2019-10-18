manifest = Rails.root.join('tmp', 'i18n-manifest.txt')
I18N_TRANSLATIONS_FILE = File.exist?(manifest) ? File.open(manifest).read : nil
