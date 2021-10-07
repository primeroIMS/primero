class CreateIndividualVictims < ActiveRecord::Migration[6.1]
  def change
    create_table :individual_victims, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :individual_victims, :data, using: :gin
  end
end
