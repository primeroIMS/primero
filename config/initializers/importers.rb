require "#{Rails.application.config.root}/app/models/importers/base.rb"

module Importers
  ACTIVE_IMPORTERS = [CSVImporter, ExcelImporter]
end
