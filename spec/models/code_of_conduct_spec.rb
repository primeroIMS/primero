require 'rails_helper'

describe CodeOfConduct do
  before :each do
    clean_data(CodeOfConduct)
  end

  describe '.current_or_new_with_user' do
    before :each do
      clean_data(User)
      @user = User.new(user_name: 'test_user_1')
      @user.save(validate: false)
    end

    it 'should return a valid code of conduct' do
      code_of_conduct = CodeOfConduct.current_or_new_with_user(
        @user, content: 'Some Content', title: 'Some Title'
      )
      expect(code_of_conduct.valid?).to eq(true)
    end

    it 'should return the current code of conduct if data is equal' do
      current = CodeOfConduct.create!(
        created_by: 'test_user_1',
        title: 'Code of Conduct 1',
        content: 'Content of the code of conduct 1',
      )

      code_of_conduct = CodeOfConduct.current_or_new_with_user(
        @user,
        content: 'Content of the code of conduct 1',
        title: 'Code of Conduct 1'
      )

      expect(code_of_conduct.id).to eq(current.id)
      expect(code_of_conduct.created_on).not_to be_nil
    end

    it 'should return a new code of conduct if data is not equal' do
      CodeOfConduct.create!(
        created_by: 'primero_cp',
        title: 'Code of Conduct 1',
        content: 'Content of the code of conduct 1',
      )

      code_of_conduct = CodeOfConduct.current_or_new_with_user(
        @user,
        title: 'Code of Conduct 2',
        content: 'Content of the code of conduct 2'
      )

      expect(code_of_conduct.id).to be_nil
      expect(code_of_conduct.created_by).to eq(@user.user_name)
    end
  end

  describe '.current' do
    content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    date_time_1 = DateTime.parse('2021/03/12 15:50:55')
    date_time_2 = DateTime.parse('2021/03/12 15:54:55')

    before :each do
      clean_data(CodeOfConduct)
      code_of_conduct_1
      code_of_conduct_2
    end

    let(:code_of_conduct_1) do
      DateTime.stub(:now).and_return(date_time_1)
      CodeOfConduct.create(created_by: 'primero_cp', title: 'Code of Conduct 1', content: content)
    end
    let(:code_of_conduct_2) do
      DateTime.stub(:now).and_return(date_time_2)
      CodeOfConduct.create(created_by: 'primero', title: 'Code of Conduct 2', content: content)
    end

    it 'should return the latest code_of_conduct based on the created_on date' do
      expect(CodeOfConduct.current).to eq(code_of_conduct_2)
    end
  end

  describe '.save' do
    it 'is not valid if title is empty' do
      code_of_conduct = CodeOfConduct.new(content: 'Some content', created_by: 'test_user_1')
      expect(code_of_conduct.save).to eq(false)
      expect(code_of_conduct.errors[:title].first).to eq('errors.models.code_of_conduct.title_present')
    end

    it 'is not valid if content is empty' do
      code_of_conduct = CodeOfConduct.new(title: 'some Title', created_by: 'test_user_1')

      expect(code_of_conduct.save).to eq(false)
      expect(code_of_conduct.errors[:content].first).to eq('errors.models.code_of_conduct.content_present')
    end

    it 'is not valid if created_by is empty' do
      code_of_conduct = CodeOfConduct.new(title: 'some Title', content: 'Some content')

      expect(code_of_conduct.save).to eq(false)
      expect(code_of_conduct.errors[:created_by].first).to eq('errors.models.code_of_conduct.created_by_present')
    end
  end
end
