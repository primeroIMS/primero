Rails.application.config.before_initialize do
  Rails.application.config.primero_host = (ENV['PRIMERO_HOST'] || ENV['LETS_ENCRYPT_DOMAIN'] || 'localhost')
end