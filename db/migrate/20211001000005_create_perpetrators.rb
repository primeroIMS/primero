class CreatePerpetrators < ActiveRecord::Migration[6.1]
  def change
    create_table :perpetrators, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :perpetrators, :data, using: :gin
  end
end
