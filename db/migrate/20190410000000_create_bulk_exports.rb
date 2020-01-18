class CreateBulkExports < ActiveRecord::Migration[5.0]
  def change
    create_table :bulk_exports do |t|
      t.string 'status'
      t.string 'owned_by'
      t.datetime 'started_on'
      t.datetime 'completed_on'
      t.string 'format'
      t.string 'record_type'
      t.string 'model_range'
      t.jsonb 'filters'
      t.jsonb 'order'
      t.string 'query'
      t.string 'match_criteria'
      t.jsonb 'custom_export_params'
      t.string 'file_name'
      t.string 'password_ciphertext'
    end
  end
end
