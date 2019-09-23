require 'rails_helper'

describe Api::V2::TransitionsController, type: :request do

  before :each do
    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_assign_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN]
    )
    @role = Role.new(permissions_list: [@permission_assign_case])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1], modules: [@primero_module])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2], modules: [@primero_module])
    @user2.save(validate: false)
    @case = Child.create(
      data: {
        name: 'Test', owned_by: 'user1',
        module_id: @primero_module.unique_id
      }
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/case/:id/transitions' do

    before :each do
      @assign1 = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @assign2 = Assign.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
    end

    it 'lists the assigns for a case' do
      sign_in(@user1)
      get "/api/v2/cases/#{@case.id}/transitions"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['record_id']).to eq(@case.id.to_s)
      expect(json['data'].map{|t| t['id']}).to include(@assign1.id, @assign2.id)
    end

    it "get a forbidden message if the user doesn't have view permission" do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case.id}/transitions"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/transitions")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

  end

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end

end