# frozen_string_literal: true

# Class to export Incident Workflow subreport
# Note: Insight (managed report) exporter names are implicitly derived from the insight name.
# See Exporters::ManagedReportExporter#subreport_exporter_class
class Exporters::IncidentsWorkflowSubreportExporter < Exporters::RecordWorkflowSubreportExporter
end
