module Exporters
  ACTIVE_EXPORTERS = [CSVExporter, ExcelExporter, JSONExporter, PhotoWallExporter, PDFExporter, UnhcrCSVExporter]

  def self.active_exporters_for_model(model)
    ACTIVE_EXPORTERS.select {|exp| exp.supported_models.include?(model) }
  end
end
