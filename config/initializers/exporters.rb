# Note: temporarily removing MRM Violations exporter
module Exporters
  ACTIVE_EXPORTERS = [
    CSVExporterListView,
    IncidentRecorderExporter,
    CSVExporter,
    ExcelExporter,
    JSONExporter,
    PhotoWallExporter,
    PDFExporter,
    UnhcrCSVExporter,
    DuplicateIdCSVExporter,
    #MRMViolationExporter,
    SelectedFieldsExcelExporter
  ]

  def self.active_exporters_for_model(model)
    ACTIVE_EXPORTERS.select {|exp| exp.supported_models.include?(model) }
  end
end
