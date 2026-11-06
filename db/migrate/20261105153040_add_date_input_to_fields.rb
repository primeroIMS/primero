class AddDateInputToFields < ActiveRecord::Migration[8.1]
  def change
    add_column :fields, :date_input, :string
  end
end
