require 'rails_helper'

describe PotentialMatchHelper do
  before do
    @potential_match = PotentialMatch.new(visible: false)
  end

  it 'hides values when the potential match is set to not visible' do
    expect(helper.mask_match_value(@potential_match, 'Billy')).to eq('***')
  end

  describe 'comparison_value' do
    context 'no value' do
      it 'should show \' - \'' do
        expect(helper.comparison_value([], nil, nil)).to eq('-')
      end
    end

    context 'with value' do
      it 'should show comma separated values' do
        expect(helper.comparison_value(['hi','hello'],nil, nil)).to eq('hi, hello')
      end

      it 'should show exact values' do
        expect(helper.comparison_value('hi', nil, nil)).to eq('hi')
      end
    end
  end
end