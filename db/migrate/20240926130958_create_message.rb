class CreateMessage < ActiveRecord::Migration[6.1]
  def change
    create_table :messages do |t|
      t.text :body
      t.timestamps
    end
  end
end
