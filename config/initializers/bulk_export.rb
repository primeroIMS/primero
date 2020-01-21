exports_directory = ENV['PRIMERO_EXPORTS_DIR'] || File.join(Rails.root, 'tmp', 'export')
Rails.application.configure do
  config.exports_directory = exports_directory
end