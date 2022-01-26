class CreateRegistries < ActiveRecord::Migration[6.1]
  def change
    create_table :registries, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :registries, :data, using: :gin
  end
end
