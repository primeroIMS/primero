class AddMandatoryForCompletionToField < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :mandatory_for_completion, :boolean, default: false
  end
end
