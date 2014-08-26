require 'exporters/base'
require 'exporters/csv'
require 'exporters/excel'

module Exporters
  ACTIVE_EXPORTERS = [CSVExporter]
end

