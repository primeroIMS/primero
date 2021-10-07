class CreateViolations < ActiveRecord::Migration[6.1]
  def change
    create_table :violations, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'incident_id'
      t.uuid 'source_id'
    end
    add_foreign_key :violations, :incidents, column: 'incident_id'
    add_index :violations, :data, using: :gin
    add_index :violations, :incident_id
    add_index :violations, :source_id

    create_table :violations_individual_victims do |t|
      t.uuid 'violation_id'
      t.uuid 'individual_victim_id'
    end
    add_index :violations_individual_victims, [:violation_id, :individual_victim_id], unique: true, name: 'index_violations_individual_victims_on_ids'

    create_table :violations_group_victims do |t|
      t.uuid 'violation_id'
      t.uuid 'group_victim_id'
    end
    add_index :violations_group_victims, [:violation_id, :group_victim_id], unique: true, name: 'index_violations_group_victims_on_ids'

    create_table :violations_perpetrators do |t|
      t.uuid 'violation_id'
      t.uuid 'perpetrator_id'
    end
    add_index :violations_perpetrators, [:violation_id, :perpetrator_id], unique: true, name: 'index_violations_perpetrators_on_ids'
  end
end
