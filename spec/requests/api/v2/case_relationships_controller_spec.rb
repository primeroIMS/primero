# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::CaseRelationshipsController, type: :request do
  include ActiveJob::TestHelper

  before :each do
    clean_data(CaseRelationship, Child, User, Role, PrimeroModule, UserGroup, Agency)

    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_case_relationships = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::UPDATE_CASE_RELATIONSHIPS, Permission::VIEW_CASE_RELATIONSHIPS
      ]
    )
    @role = Role.new(permissions: [@permission_case_relationships], primero_modules: [@primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user = User.new(user_name: 'user', role: @role, user_groups: [@group1])
    @user.save(validate: false)

    @case1 = Child.create!(data: { name: 'Test1', age: 5, sex: 'male', owned_by: 'user',
                                   module_id: @primero_module.unique_id })
    @case2 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user',
                                   module_id: @primero_module.unique_id })
    @case3 = Child.create!(data: { name: 'Test3', age: 3, sex: 'male', owned_by: 'user',
                                   module_id: @primero_module.unique_id })
    @case4 = Child.create!(data: { name: 'Test3', age: 2, sex: 'male', owned_by: 'user',
                                   module_id: @primero_module.unique_id })
    @farmer1 = Child.create!(data: { name: 'Test4', age: 3, sex: 'female', owned_by: 'user',
                                     module_id: @primero_module.unique_id })
    @farmer2 = Child.create!(data: { name: 'Test5', age: 5, sex: 'male', owned_by: 'user',
                                     module_id: @primero_module.unique_id })

    @case_relationship1 = CaseRelationship.new_case_relationship(
      primary_case_id: @case1.id, related_case_id: @farmer1.id, relationship_type: 'farmer_on'
    )
    @case_relationship2 = CaseRelationship.new_case_relationship(
      primary_case_id: @case3.id, related_case_id: @farmer1.id, relationship_type: 'farmer_on'
    )
    @case_relationship3 = CaseRelationship.new_case_relationship(
      primary_case_id: @farmer2.id, related_case_id: @case2.id, relationship_type: 'farm_for'
    )
    @case_relationship4 = CaseRelationship.new_case_relationship(
      primary_case_id: @farmer2.id, related_case_id: @case4.id, relationship_type: 'farm_for'
    )
    @case_relationship5 = CaseRelationship.new_case_relationship(
      primary_case_id: @farmer2.id, related_case_id: @case3.id, relationship_type: 'farm_for'
    )
    @case_relationship5.disabled = true

    [@case_relationship1, @case_relationship2, @case_relationship3, @case_relationship4,
     @case_relationship5].each(&:save!)
  end

  let!(:agency_a) { Agency.create!(name: 'Agency A', agency_code: 'agency_a') }
  let!(:agency_b) { Agency.create!(name: 'Agency B', agency_code: 'agency_b') }
  let!(:agency_role) do
    role = Role.new(
      permissions: [@permission_case_relationships],
      primero_modules: [@primero_module],
      group_permission: Permission::AGENCY
    )
    role.save(validate: false)
    role
  end
  let!(:agency_a_worker) do
    user = User.new(user_name: 'agency_a_worker', role: agency_role, agency_id: agency_a.id)
    user.save(validate: false)
    user
  end
  let!(:agency_b_worker) do
    user = User.new(user_name: 'agency_b_worker', role: agency_role, agency_id: agency_b.id)
    user.save(validate: false)
    user
  end
  let!(:agency_a_case) do
    Child.create!(data: { name: 'Agency A case', age: 6, sex: 'female',
                          owned_by: agency_a_worker.user_name,
                          module_id: @primero_module.unique_id })
  end
  let!(:agency_b_case) do
    Child.create!(data: { name: 'Agency B victim', age: 8, sex: 'female',
                          survivor_code_no: 'SURV-B-0001', owned_by: agency_b_worker.user_name,
                          module_id: @primero_module.unique_id })
  end
  let!(:agency_b_other_case) do
    Child.create!(data: { name: 'Agency B other case', age: 9, sex: 'male',
                          owned_by: agency_b_worker.user_name,
                          module_id: @primero_module.unique_id })
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.find { |job| job[:job] == AuditLogJob }[:args].first }

  describe 'GET /api/v2/:recordType/:recordId/case_relationships' do
    it 'list case_relationships of a case' do
      sign_in(@user)
      get "/api/v2/cases/#{@farmer2.id}/case_relationships?relationship_type=farm_for"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |elem| elem['case_id'] }).to match_array(
        [@case2.id.to_s, @case3.id.to_s, @case4.id.to_s]
      )
      expect(json['data'].map { |elem| elem['relationship_type'] }).to match_array(%w[farm_for farm_for farm_for])
    end

    it "get a forbidden message if the user doesn't have case relationship permission" do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case1.id}/case_relationships"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/case_relationships")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/:recordType/:recordId/case_relationships' do
    it 'creates a new case_relationship to a case' do
      sign_in(@user)
      farmer = Child.create!(data: { name: 'Test1', age: 5, sex: 'male', owned_by: 'user',
                                     module_id: @primero_module.unique_id })
      case1 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user',
                                    module_id: @primero_module.unique_id })
      params = { data: { case_id: farmer.id, relationship_type: 'farmer_on' } }
      post("/api/v2/cases/#{case1.id}/case_relationships", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['case_id']).to eq(farmer.id.to_s)
      expect(json['data']['relationship_type']).to eq('farmer_on')
    end

    it "get a forbidden message if the user doesn't have case relationship permission" do
      login_for_test(permissions: [])
      farmer = Child.create!(data: { name: 'Test1', age: 5, sex: 'male', owned_by: 'user',
                                     module_id: @primero_module.unique_id })
      case1 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user',
                                    module_id: @primero_module.unique_id })
      params = { data: { case_id: farmer.id, relationship_type: 'farmer_on' } }
      post("/api/v2/cases/#{case1.id}/case_relationships", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{case1.id}/case_relationships")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'enqueues an audit log job that records the case relationship attempt' do
      sign_in(@user)
      farmer = Child.create!(data: { name: 'Test1', age: 5, sex: 'male', owned_by: 'user',
                                     module_id: @primero_module.unique_id })
      case1 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user',
                                    module_id: @primero_module.unique_id })
      params = { data: { case_id: farmer.id, relationship_type: 'farmer_on' } }
      post("/api/v2/cases/#{case1.id}/case_relationships", params:)

      expect(AuditLogJob).to have_been_enqueued
        .with(record_type: 'Child',
              record_id: case1.id,
              action: 'create',
              user_id: @user.id,
              resource_url: request.url,
              metadata: { user_name: @user.user_name, remote_ip: '127.0.0.1', agency_id: nil, role_id: @role.id,
                          http_method: 'POST', record_ids: [] })
    end

    it 'returns 403 when a user cannot access a case' do
      sign_in(agency_a_worker)

      post "/api/v2/cases/#{agency_a_case.id}/case_relationships",
           params: { data: { case_id: agency_b_case.id, relationship_type: 'farmer_on' } }

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{agency_a_case.id}/case_relationships")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'PATCH /api/v2/:recordType/:recordId/case_relationships' do
    it 'disables a case_relationship to a case' do
      sign_in(@user)
      params = { data: { primary: true } }
      patch("/api/v2/cases/#{@case2.id}/case_relationships/#{@case_relationship3.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['case_id']).to eq(@farmer2.id.to_s)
      expect(json['data']['primary']).to eq(true)
    end

    it 'returns 404 when is not a relationship of the case' do
      sign_in(agency_a_worker)

      relationship = CaseRelationship.create!(
        from_case: agency_b_case, to_case: agency_b_other_case, relationship_type: 'farmer_on'
      )

      patch "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}",
            params: { data: { primary: true } }

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['status']).to eq(404)
      expect(json['errors'][0]['resource']).to eq(
        "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"
      )
      expect(json['errors'][0]['message']).to eq('Not Found')
    end

    it 'returns 403 when a user cannot access a case' do
      sign_in(agency_a_worker)

      relationship = CaseRelationship.create!(
        from_case: agency_a_case, to_case: agency_b_case, relationship_type: 'farmer_on'
      )

      patch "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}",
            params: { data: { primary: true } }

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq(
        "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"
      )
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/:recordType/:recordId/case_relationships' do
    it 'disables a case_relationship to a case' do
      sign_in(@user)
      delete("/api/v2/cases/#{@case2.id}/case_relationships/#{@case_relationship3.id}")

      expect(response).to have_http_status(200)
      expect(json['data']['case_id']).to eq(@farmer2.id.to_s)
      expect(json['data']['relationship_type']).to eq('farmer_on')
      expect(json['data']['disabled']).to eq(true)
    end

    it 'returns a 404 when is not a relationship of the case' do
      sign_in(agency_a_worker)

      relationship = CaseRelationship.create!(
        from_case: agency_b_case, to_case: agency_b_other_case, relationship_type: 'farmer_on'
      )

      delete "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['status']).to eq(404)
      expect(json['errors'][0]['resource']).to eq(
        "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"
      )
      expect(json['errors'][0]['message']).to eq('Not Found')
    end

    it 'returns 403 when a user cannot access a case' do
      sign_in(agency_a_worker)

      relationship = CaseRelationship.create!(
        from_case: agency_a_case, to_case: agency_b_case, relationship_type: 'farmer_on'
      )

      delete "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq(
        "/api/v2/cases/#{agency_a_case.id}/case_relationships/#{relationship.id}"
      )
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  after :each do
    clear_performed_jobs
    clear_enqueued_jobs
  end

  after do
    clear_enqueued_jobs
    clean_data(CaseRelationship, Child, User, Role, PrimeroModule, UserGroup, Agency)
  end
end
