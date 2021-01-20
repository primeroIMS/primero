require 'rails_helper'

describe FormSectionResponse do
  context 'with no response or form section' do
    let :response do FormSectionResponse.new(response: nil, form_section: nil) end

    describe '#complete?' do
      it "should be false" do
        expect(response.complete?).to be false
      end
    end
  end

  context 'with a response but no form section' do
  end

  context 'with no response but a form section' do
    let :response do
      FormSectionResponse.new(
        response: nil,
        form_section: FormSection.new(
          fields: [Field.new(mandatory_for_completion: true)]
        )
      )
    end

    describe '#complete?' do
      it "should be false as a nil response can't be complete" do
        expect(response.complete?).to be false
      end
    end
  end

  context 'with a response and a form section' do
    let :response do
      FormSectionResponse.new(
        response: { 'test_1' => 'result_1' },
        form_section: FormSection.new(
          fields: [Field.new(name: 'test_1', mandatory_for_completion: true)]
        )
      )
    end

    it 'should be true when mandatory fields have values' do
      expect(response.complete?).to be true
    end
  end
end
