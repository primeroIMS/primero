class AddAllowCaseCreationToTransitions < ActiveRecord::Migration[6.1]
  def change
    add_column :transitions, :allow_case_creation, :boolean
  end
end
