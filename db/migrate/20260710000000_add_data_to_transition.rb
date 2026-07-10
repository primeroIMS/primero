class AddDataToTransition < ActiveRecord::Migration[8.1]
  def change
    add_column :transitions, :data, :jsonb
  end
end
