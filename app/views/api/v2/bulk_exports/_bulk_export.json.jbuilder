json.merge! bulk_export.attributes.except('format').merge('export_format' => bulk_export.format).compact # TODO: Exclude file_name and password
json.export_file rails_blob_path(bulk_export.export_file, only_path: true) if bulk_export.export_file.attached?
