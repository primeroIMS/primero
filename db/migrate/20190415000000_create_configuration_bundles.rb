class CreateConfigurationBundles < ActiveRecord::Migration[5.0]
  def change
    create_table :configuration_bundles do |t|
      t.string    'applied_by'
      t.datetime  'applied_at', null: false, default: -> { 'CURRENT_TIMESTAMP' }
    end
  end
end
