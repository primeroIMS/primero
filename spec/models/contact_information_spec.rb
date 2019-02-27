require 'rails_helper'

describe ContactInformation do
  before :each do
    ContactInformation.all.each(&:destroy)
  end
  describe "get_or_create" do
    it "Should create the contact information if it does not exist" do
      contact_info = ContactInformation.get_or_create
      contact_info.should_not be_nil
      expect(ContactInformation.first.id).to eq(contact_info.id)
    end
  end
end
