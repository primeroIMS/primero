require 'rails_helper'

describe TransitionActions, type: :controller do

  controller(ApplicationController) do
    include RecordActions
    include TransitionActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    Child.all.each &:destroy
    Role.all.each &:destroy
  end

  describe 'transition' do
    before do
      routes.draw {
        post 'transition' => 'anonymous#transition'
      }
    end

    context 'passing ids' do
      before do
        User.stub(:find_by_user_name).and_return(@user)
        @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => PrimeroModule::CP,
                              :consent_for_services => true, :disclosure_other_orgs => true)
        @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => PrimeroModule::CP,
                              :consent_for_services => true, :disclosure_other_orgs => true)
        @user2 = User.new(:user_name => 'primero_cp', :role_ids => ['referer'], :module_ids => [PrimeroModule::CP])
      end

      it 'allows referrals from users with the referral permission' do
        permission_transition = Permission.new(resource: Permission::CASE, actions: [Permission::REFERRAL])
        Role.create(id: 'referer', name: 'referer', permissions_list: [permission_transition], group_permission: Permission::GROUP)

        @user = User.new(:user_name => 'referring_user', :role_ids => ['referer'])
        @session = fake_login @user

        User.stub(:find_by_user_name).with(@user2.user_name).and_return(@user2)

        controller.instance_variable_set(:@new_user, @user2)

        params = {
          :selected_records => [@case1.id, @case2.id].join(','),
          :transition_type => "referral",
          :consent_override => "true",
          :existing_user => "primero_cp",
          :transition_role => "role-referral",
          :service => "Safehouse Service",
          :notes => "test",
          :type_of_export => Transitionable::EXPORT_TYPE_PRIMERO,
        }
        post :transition, params: params
        flash[:notice].should eq("2 Referral(s) successfully made")
        response.status.should_not == 403
      end
    end

    describe 'request_transfer' do
      before do
        routes.draw {
          put 'request_transfer' => 'anonymous#request_transfer'
        }

        @agency = Agency.new(id: 'agency-foo', name: 'FOO AGENCY', agency_code: 'abc123')
        permission_owner = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
        Role.create(id: 'owner', name: 'owner', permissions_list: [permission_owner], group_permission: Permission::GROUP)
        @user_owner = User.new(:user_name => 'original_owner', :role_ids => ['owner'], :email => 'foo@test.com')
        User.stub(:find_by_user_name).and_return(@user)
        User.any_instance.stub(:agency).and_return(@agency)
        Child.any_instance.stub(:owner).and_return(@user_owner)

        @case3 = Child.create(name: 'Test Case 3', short_id: 'ccc333', module_id: PrimeroModule::CP,
                              consent_for_services: true, disclosure_other_orgs: true, owned_by: @user_owner.user_name)
      end


      context 'when user with permission is logged in' do
        before do
          permission_request_transfer = Permission.new(resource: Permission::CASE, actions: [Permission::REQUEST_TRANSFER])
          Role.create(id: 'requester', name: 'requester', permissions_list: [permission_request_transfer], group_permission: Permission::GROUP)
          @user = User.new(:user_name => 'requesting_user', :role_ids => ['requester'])
          @session = fake_login @user

          User.stub(:find_by_user_name).with(@user.user_name).and_return(@user)
        end

        it 'adds a transition to the record' do
          params = { id: @case3.id, request_transfer_notes: 'Test Transfer Message' }
          expected = {success: true, error_message: '', reload_page: true}.to_json
          put :request_transfer, params: params
          expect(response.body).to eq(expected)
        end

        context 'and record id does not exist' do
          it 'returns an error response' do
            params = { id: 'bogus_id', request_transfer_notes: 'Test Transfer Message' }
            expected = {success: false, error_message: 'Record not found', reload_page: true}.to_json
            put :request_transfer, params: params
            expect(response.body).to eq(expected)
          end
        end
      end
    end
  end
end
