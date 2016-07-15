require 'spec_helper'

include UNHCRMapping

describe UNHCRMapping do
  before do
    Child.any_instance.stub(:field_definitions).and_return([])
    SystemSettings.all.each &:destroy
        @system_settings = SystemSettings.create default_locale: "en",
                              case_code_format: ["created_by_user.code"],
                              unhcr_needs_codes_mapping: {
                                "_id" => "needs_codes_mapping",
                                "autocalculate" => "true",
                                "mapping" => {"protection ab" => "AB", "protection cd" => "CD"}
                              }
  end

  describe 'empty protection_concerns' do
    it 'should return nil for unhcr_needs_codes' do
      # is there a difference? 
      # child = Child.create! case_id: '123', created_by: 'user'
      child = Child.new
      child.attributes = {'name' => 'Bob'}
      child.save!

      expect(child['unhcr_needs_codes']).to eq(nil)
    end
  end

end