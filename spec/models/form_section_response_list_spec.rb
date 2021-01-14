require 'rails_helper'

describe FormSectionResponseList do
  context 'when empty' do
    let :responses do
      FormSectionResponseList.new(responses: [], form_section: nil)
    end

    describe '#field' do
      it 'should return an empty list' do
        expect(responses.field(:a_field_name)).to be_empty
      end
    end

    describe '#subform' do
      it 'should return an empty FormSectionResponseList' do
        expect(responses.subform(:a_subform_name)).to be_a(FormSectionResponseList)
      end
    end
  end

  context 'with responses and a form section' do
    response = {
      'field_1' => 'result_1',
      'subform_1' => [{
        'field_2' => 'result_2'
      }]
    }

    let :responses do
      FormSectionResponseList.new(
        responses: [response],
        form_section: FormSection.new()
      )
    end

    describe '#field' do
      it 'should return an array with the result of each field for each response' do
        expect(responses.field(:field_1)).to include(response['field_1'])
      end
    end

    describe '#subform' do
      it 'should return a FormSectionResponseLists' do
        expect(responses.subform(:subform_1)).to be_a(FormSectionResponseList)
      end

      it 'should have all of the subform responses' do
        expect(responses.subform(:subform_1).count).to eql(response['subform_1'].count)
      end
    end
  end
end
