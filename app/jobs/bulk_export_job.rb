class BulkExportJob < ActiveJob::Base
  queue_as :export

  def perform(bulk_export_id, opts={})
    bulk_export = BulkExport.get(bulk_export_id) #We are Rails 4.0 and don't use GlobalId yet

    user = bulk_export.owner

    #In batches, retrieve the records
    records = bulk_export.retrieve_records

    #Calculate the permitted properties for the user to export
    permitted_properties = bulk_export.permitted_properties

    #Other custom export options
    options = bulk_export.custom_export_params

    #Run the exporter on the records
    export_data = bulk_export.exporter.export(records, permitted_properties, user, options)

    #TODO: Zip & Encrypt? This should happen later
    bulk_export.build_export_file(export_data)

    bulk_export.mark_completed
  end




end