# frozen_string_literal: true

# A factory for instantiating BulkExports from the API params
class BulkExportBuilderService
  def self.build(params, user)
    return unless params[:format] && params[:record_type] && params[:password]

    # TODO: Destringify the params?
    # TODO: Something about password
    export = bulk_export_class(params[:format]).new(params)
    export.owner = user
    export
  end

  def self.bulk_export_class(format)
    if format == Exporters::DuplicateIdCSVExporter.id
      DuplicateBulkExport
    else
      BulkExport
    end
  end
end