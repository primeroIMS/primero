
class CreateCaseRelationships < ActiveRecord::Migration[6.1]
  def change
    create_table :case_relationships, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.uuid :case_id_1
      t.uuid :case_id_2
      t.string :relationship_type
      t.boolean :disabled

      t.timestamps
    end

    add_index :case_relationships, :case_id_1
    add_index :case_relationships, :case_id_2
    add_index :case_relationships, [:case_id_1, :case_id_2], unique: true
  end
end
