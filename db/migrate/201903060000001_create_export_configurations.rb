class CreateExportConfigurations < ActiveRecord::Migration[5.0]
  def change
    create_table :export_configurations do |t|
      t.string 'unique_id'
      t.string 'export_id'
      t.jsonb 'name_i18n'
      t.string 'property_keys', array: true, default: []
      t.string 'record_type', default: 'Child'  # Child, TracingRequest, or Incident
      t.string 'opt_out_field' # Field on the Record that indicates if the individual wants to opt out of sharing info in the export
      t.string 'property_keys_opt_out', array: true, default: [] # Only these fields will export if individual opts out
    end
    add_index :export_configurations, :unique_id, unique: true
  end
end
