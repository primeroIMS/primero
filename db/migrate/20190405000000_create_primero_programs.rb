class CreatePrimeroPrograms < ActiveRecord::Migration[5.0]
  def change
    create_table :primero_programs do |t|
      t.string  'unique_id'
      t.jsonb   'name_i18n'
      t.jsonb   'description_i18n'
      t.date    'start_date'
      t.date    'end_date'
      t.boolean 'core_resource', null: false, default: false
    end
  end
end
