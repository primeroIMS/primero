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
    #TODO - does this go here?
    # This exporter needs to show only in Bangladesh, not in other configs
    # DuplicateMohaIdCSVExporter,
    MRMViolationExporter,
    SelectedFieldsExcelExporter
  ]

  def self.active_exporters_for_model(model)
    ACTIVE_EXPORTERS.select {|exp| exp.supported_models.include?(model) }
  end
end
