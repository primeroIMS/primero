class CreateBulkExports < ActiveRecord::Migration[5.0]
  def change
    create_table :bulk_exports, id: :uuid, default: 'gen_random_uuid()' do |t|
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
      #TODO: Temporarily we are going to store INSECURELY the password.
      #      Going forward, a random password will be generated for each export at download time
      t.string 'password'
    end
  end
end
