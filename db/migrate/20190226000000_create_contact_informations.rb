class CreateContactInformations < ActiveRecord::Migration[5.0]
  def change
    #TODO: Should at least name be required?
    create_table :contact_informations do |t|
      t.string 'name'
      t.string 'organization'
      t.string 'phone'
      t.string 'location'
      t.text 'other_information'
      t.string 'support_forum'
      t.string 'email'
      t.string 'position'
    end
  end
end
