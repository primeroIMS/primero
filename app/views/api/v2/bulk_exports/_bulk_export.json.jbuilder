# frozen_string_literal: true

json.merge! bulk_export.attributes.except(%w[format password_ciphertext file_name])
                       .merge('export_format' => bulk_export.format).compact
json.export_file bulk_export.url if bulk_export.export_file.attached?
