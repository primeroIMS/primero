# frozen_string_literal: true

# TODO: This is only used by the BulkExport to derive the exporter from the
#       export format and record type. Should refactor and move to BulkExport.
# TODO: Temporarily removing MRM Violations exporter
module Exporters
  ACTIVE_EXPORTERS = [
    IncidentRecorderExporter,
    CSVListViewExporter,
    CSVExporter,
    ExcelExporter,
    JSONExporter,
    # PhotoWallExporter,
    PDFExporter,
    UnhcrCSVExporter,
    DuplicateIdCSVExporter,
    # #MRMViolationExporter,
    SelectedFieldsExcelExporter
  ].freeze

  def self.active_exporters_for_model(model)
    ACTIVE_EXPORTERS.select { |exp| exp.supported_models.include?(model) }
  end
end
