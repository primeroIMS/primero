class CreateRegistryRecords < ActiveRecord::Migration[6.1]
  def change
    create_table :registry_records, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :registry_records, :data, using: :gin
  end
end
