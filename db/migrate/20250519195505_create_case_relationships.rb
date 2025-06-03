
class CreateCaseRelationships < ActiveRecord::Migration[6.1]
  def change
    create_table :case_relationships, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.uuid :from_case_id
      t.uuid :to_case_id
      t.string :relationship_type
      t.boolean :disabled
      t.boolean :primary

      t.timestamps
    end

    add_index :case_relationships, :from_case_id
    add_index :case_relationships, :to_case_id
    add_index :case_relationships, [:from_case_id, :to_case_id], unique: true
  end
end

