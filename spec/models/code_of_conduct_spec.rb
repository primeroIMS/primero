require 'rails_helper'

describe CodeOfConduct do
  before :each do
    clean_data(CodeOfConduct)
  end

  describe '.current' do
    content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    date_time_1 = DateTime.parse('2021/03/12 15:50:55')
    date_time_2 = DateTime.parse('2021/03/12 15:54:55')

    let(:code_of_conduct_1) do
      DateTime.stub(:now).and_return(date_time_1)
      CodeOfConduct.create(created_on: DateTime.now, created_by: 'primero_cp', content: content)
    end
    let(:code_of_conduct_2) do
      DateTime.stub(:now).and_return(date_time_2)
      CodeOfConduct.create(created_on: DateTime.now, created_by: 'primero', content: content)
    end
    before(:each) do
      clean_data(CodeOfConduct)
      code_of_conduct_1
      code_of_conduct_2
    end

    it 'should return the latest code_of_conduct based on the created_on date' do
      expect(CodeOfConduct.current).to eq(code_of_conduct_2)
    end
  end
end
