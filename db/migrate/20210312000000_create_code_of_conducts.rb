class CreateCodeOfConducts < ActiveRecord::Migration[5.2]
  def change
    create_table :code_of_conducts do |t|
      t.datetime 'created_on'
      t.string 'created_by'
      t.text 'content'
    end
  end
end
