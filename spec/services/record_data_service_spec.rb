require 'rails_helper'

describe RecordDataService do

  before :each do
    permission = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
    @role = Role.new(permissions: [permission])
    @role.save(validate: false)
    @user = User.new(user_name: 'user1', role: @role)
    @record = Child.new_with_user(@user, name: 'Test', hidden_name: true, field1: 'value1', field2: nil)
    @record.stub(:flag_count).and_return(2)
  end

  describe 'select_fields' do
    let(:data) { RecordDataService.select_fields(@record.data, %w[name field2]) }

    it 'discards nil value fields' do
      expect(data.key?('field2')).to be_falsey
    end

    it 'selects only the requested fields' do
      expect(data.keys).to match_array(%w[name])
    end
  end

  describe 'embed_user_scope' do
    it 'returns true if the user is the record owner and is scoped to associated records' do
      data =  RecordDataService.embed_user_scope({}, @record, %w[record_in_scope], @user)
      expect(data['record_in_scope']).to be_truthy
    end

    it 'returns false if the user is not the record owner and is scored to associated records' do
      user2 = User.new(user_name: 'user2', role: @role)
      data =  RecordDataService.embed_user_scope({}, @record, %w[record_in_scope], user2)
      expect(data['record_in_scope']).to be_falsey
    end
  end

  describe 'embed_hidden_name' do
    it 'masks the hidden name if specified as such on the record' do
      data =  RecordDataService.embed_hidden_name({}, @record, %w[name])
      expect(data['name']).to match(/\*+/)
    end
  end

  describe 'embed_flag_metadata' do
    it 'injects the flag count' do
      data = RecordDataService.embed_flag_metadata({}, @record, %[flag_count])
      expect(data['flag_count']).to eq(2)
    end
  end

  describe 'embed_photo_metadata' do
    before :each do
      blob = ActiveStorage::Blob.create_after_upload!(
        io: File.open('spec/resources/jorge.jpg'),
        filename: 'jorge.jpg',
        content_type: 'image/jpg')
      @record.photos.build('image' => blob)
      @record.save!
    end

    it 'injects the paths to the photo' do
      data = RecordDataService.embed_photo_metadata({}, @record, %w[photos])
      expect(data['photos'].size).to eq(1)
      expect(data['photos'][0]).to match(/.+jorge\.jpg$/)
    end

    after :each do
      Child.destroy_all
      AttachmentImage.destroy_all
    end
  end

  after :each do
    Role.destroy_all
  end


end