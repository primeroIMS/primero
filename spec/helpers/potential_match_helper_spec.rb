require 'rails_helper'

describe PotentialMatchHelper do
  before do
    @potential_match = PotentialMatch.new(visible: false)
  end

  it 'hides values when the potential match is set to not visible' do
    expect(helper.mask_match_value(@potential_match, 'Billy')).to eq('***')
  end
end