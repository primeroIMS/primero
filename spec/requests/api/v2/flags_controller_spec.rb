require 'rails_helper'

describe Api::V2::FlagsController, type: :request do
  before :each do
    Flag.destroy_all
    Child.destroy_all
    @case1 = Child.create!(data: { name: "Test1", age: 5, sex: 'male' })
    @case2 = Child.create!(data: { name: "Test2", age: 7, sex: 'female' })
    @case1.add_flag('This is a flag', Date.today, 'faketest')
    @permission_flag_record = [ Permission.new(resource: Permission::CASE,
                                               actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]),
                                Permission.new(resource: Permission::TRACING_REQUEST,
                                               actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]),
                                Permission.new(resource: Permission::INCIDENT,
                                               actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG])]
end
 
  let(:json) { JSON.parse(response.body) }
 
  describe 'GET /api/v2/:recordType/:recordId/flags' do
    it 'list flags of a case' do
      login_for_test(permissions: @permission_flag_record)
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
      expect(json['data'][0]['record_type']).to eq( @case1.class.name)
      expect(json['data'][0]['message']).to eq( 'This is a flag')
      expect(json['data'][0]['removed']).to be false
    end
  end

  describe 'POST /api/v2/:recordType/:recordId/flags' do
    it 'creates a new flag to a case' do
      login_for_test(permissions: @permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][1]['record_id']).to eq( @case1.id.to_s)
      expect(json['data'][1]['record_type']).to eq( @case1.class.name)
      expect(json['data'][1]['message']).to eq( 'This is another flag')
      expect(json['data'][1]['removed']).to be_falsey
    end
  end

  describe 'PATCH /api/v2/:recordType/:recordId/flags/:id' do
    it 'unflag a case' do
      login_for_test(permissions: @permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      @case1.reload
      expect(@case1.flags.first.removed).to be_truthy
      expect(@case1.flags.first.unflag_message).to eq('This is unflag message')
      expect(@case1.flags.first.unflagged_date).to eq(Date.today)
      expect(@case1.flags.first.unflagged_by).to eq('faketest')
    end
  end

  describe 'POST /api/v2/:recordType/flags' do
    it 'flagging cases in bulk' do
      login_for_test(permissions: @permission_flag_record)
      expect(@case1.flag_count).to eq(1)
      expect(@case2.flag_count).to eq(0)

      params = { data: { ids: [@case1.id, @case2.id], record_type: 'case', date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/flags", params: params

      expect(response).to have_http_status(204)
      @case1.reload
      @case2.reload
      expect(@case1.flag_count).to eq(2)
      expect(@case2.flag_count).to eq(1)
    end
  end

end
