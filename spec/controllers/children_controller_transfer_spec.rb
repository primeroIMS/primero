require 'spec_helper'

describe ChildrenController do

  before do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}

    permission_transition = Permission.new(resource: Permission::CASE, actions: [Permission::TRANSFER, Permission::READ, Permission::WRITE, Permission::CREATE])
    Role.create(id: 'transfer', name: 'transfer', permissions_list: [permission_transition], group_permission: Permission::GROUP)

    @user = User.create!(:user_name => 'transfering_user', :role_ids => ['transfer'], :module_ids => [PrimeroModule::CP],
      :full_name => "transfering_user", :organization => "UNICEF",
      :password => "Password0001", :password_confirmation => "Password0001")

    @user2 = User.create!(:user_name => 'primero_cp', :role_ids => ['transfer'], :module_ids => [PrimeroModule::CP],
      :full_name => "primero_cp", :organization => "UNICEF",
      :password => "Password0001", :password_confirmation => "Password0001")

    @user3 = User.create!(:user_name => 'business_user', :role_ids => ['transfer'], :module_ids => [PrimeroModule::CP],
      :full_name => "business_user", :organization => "UNICEF",
      :password => "Password0001", :password_confirmation => "Password0001")

    User.stub(:find_by_user_name).with(@user.user_name).and_return(@user)
    User.stub(:find_by_user_name).with(@user2.user_name).and_return(@user2)
    User.stub(:find_by_user_name).with(@user3.user_name).and_return(@user3)

    @case_to_transfer = Child.create(:name => 'Juan Perez', :module_id => PrimeroModule::CP,
      :consent_for_services => true, :disclosure_other_orgs => true, :created_by => @user.user_name, :last_updated_by => @user.user_name)

  end

  after do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}
  end

  describe "Transfers" do
    it "should create the transfers record and set In progress transfer status" do
      @session = fake_login @user
      instance = @case_to_transfer

      controller.stub :render
      controller.stub :redirect_to

      controller.should_receive(:is_consent_given?).with(instance).and_call_original
      controller.should_receive(:is_reassign?).exactly(5).times.and_call_original
      controller.should_receive(:consent_override).twice.and_call_original
      controller.should_receive(:log_to_history).with([instance]).and_call_original
      controller.should_receive(:is_remote?).exactly(6).times.and_call_original
      controller.should_not_receive(:remote_transition)
      controller.should_receive(:local_transition).with([instance]).and_call_original

      params = {
        :consent_override => "false",
        "selected_records"=>"",
        "transition_type"=>"transfer",
        "existing_user"=>@user3.user_name,
        "transition_role"=>"role-transfer",
        "other_user_agency"=>"",
        "notes"=>"Successfully transferred",
        "type_of_export"=>Transitionable::EXPORT_TYPE_PRIMERO,
        "file_name"=>"",
        "is_remote"=>false,
        "id"=>instance.id
      }

      post :transition, params

      flash[:notice].should eq("Case #{instance.short_id} successfully transferred")
      assigns[:records].should eq([instance])

      child_transferred = Child.get(instance.id)
      child_transferred.transfer_status.should eq(Transition::TO_USER_LOCAL_STATUS_INPROGRESS)
      child_transferred.assigned_user_names.should eq([@user3.user_name])

      transfers = child_transferred.transfers
      transfers.size.should eq(1)

      transfer = transfers.first
      transfer.to_user_local.should eq(@user3.user_name)
      transfer.to_user_remote.should eq("")
      transfer.to_user_agency.should eq("")
      transfer.to_user_local_status.should eq(Transition::TO_USER_LOCAL_STATUS_INPROGRESS)
      transfer.notes.should eq("Successfully transferred")
      transfer.transitioned_by.should eq(@user.user_name)
      transfer.service.should eq("")
      transfer.is_remote.should eq(false)
      transfer.type_of_export.should eq(Transitionable::EXPORT_TYPE_PRIMERO)
      transfer.consent_overridden.should eq(false)

    end

    context "Accept/Reject transfers" do
      before do
        @case_to_transfer = Child.new(:name => 'Juana Perez', :module_id => PrimeroModule::CP,
            :consent_for_services => true, :disclosure_other_orgs => true,
            :created_by => @user.user_name, :last_updated_by => @user.user_name,
            :transfer_status => Transition::TO_USER_LOCAL_STATUS_INPROGRESS)
        @case_to_transfer.assigned_user_names = [@user2.user_name]
        @case_to_transfer.owner = @user
        @case_to_transfer.owned_by = @user.user_name
        @case_to_transfer.add_transition("transfer", @user2.user_name, "", "", Transition::TO_USER_LOCAL_STATUS_INPROGRESS,
            "do you take care?", false, Transitionable::EXPORT_TYPE_PRIMERO, @user.user_name, false, "")
        @case_to_transfer.save!
      end

      after do
        @case_to_transfer.destroy!
      end

      shared_examples_for "Accept/Reject transfers" do |transfer_status|
        it "should see message for #{transfer_status} action" do
          controller.stub :render
          controller.stub :redirect_to

          @session = fake_login user

          params = {
            "id"=>id,
            "transition_id" => transfers_id,
            "transition_status" => transfer_status
          }
          if defined?(rejected_reason)
            params[:rejected_reason] = rejected_reason
          end

          post :transfer_status, params
          flash[:notice].should eq(notice)

          child_transferred = Child.get(id)
          child_transferred.transfer_status.should eq(transfer_status)
          child_transferred.assigned_user_names.should eq(assigned_user_names)
          child_transferred.owned_by.should eq(owned_by)
          child_transferred.previously_owned_by.should eq(previously_owned_by)

          transfers = child_transferred.transfers
          transfers.size.should eq(1)

          transfer = transfers.first
          transfer.to_user_local_status.should eq(transfer_status)
          if defined?(rejected_reason)
            transfer.rejected_reason.should eq(rejected_reason)
          end
        end

      end

      it_behaves_like "Accept/Reject transfers", Transition::TO_USER_LOCAL_STATUS_ACCEPTED do
        let(:id) { @case_to_transfer.id }
        #Logged user that is going to to the Accepted transfer.
        let(:user) { @user2 }
        let(:transfers_id) { @case_to_transfer.transfers.first.id }
        let(:notice) { "Case #{@case_to_transfer.short_id} successfully transferred" }
        #Logged user will going to be removed from the access of the record.
        let(:assigned_user_names) { [] }
        #Ownership changed because the user Accepted the transfer.
        let(:previously_owned_by) { @user.user_name }
        let(:owned_by) { @user2.user_name }
      end

      it_behaves_like "Accept/Reject transfers", Transition::TO_USER_LOCAL_STATUS_REJECTED do
        let(:id) { @case_to_transfer.id }
        #Logged user that is going to to the Rejected transfer.
        let(:user) { @user2 }
        let(:rejected_reason) { "No reason" }
        let(:transfers_id) { @case_to_transfer.transfers.first.id }
        let(:notice) { "Case #{@case_to_transfer.short_id} transfer rejected" }
        #Logged user will going to be removed from the access of the record.
        let(:assigned_user_names) { [] }
        #Ownership did not change because the user Rejected the transfer.
        let(:previously_owned_by) { @user.user_name }
        let(:owned_by) { @user.user_name }
      end

      it "should display invalid status" do
        controller.stub :render
        controller.stub :redirect_to

        @session = fake_login @user2

        params = {
          "id"=>@case_to_transfer.id,
          "transition_id" => @case_to_transfer.transfers.first.id,
          "transition_status" => "Some Status"
        }
        post :transfer_status, params
        flash[:notice].should eq("Unknown transfer status: Some Status")
      end

      it "should display unknown transfer" do
        controller.stub :render
        controller.stub :redirect_to

        @session = fake_login @user2

        params = {
          "id"=>@case_to_transfer.id,
          "transition_id" => "fubar_id",
          "transition_status" => Transition::TO_USER_LOCAL_STATUS_ACCEPTED
        }
        post :transfer_status, params
        flash[:notice].should eq("Case #{@case_to_transfer.short_id} invalid transfer")
      end

      it "should display invalid transfer" do
        controller.stub :render
        controller.stub :redirect_to

        @session = fake_login @user3

        params = {
          "id"=>@case_to_transfer.id,
          "transition_id" => @case_to_transfer.transfers.first.id,
          "transition_status" => Transition::TO_USER_LOCAL_STATUS_ACCEPTED
        }
        post :transfer_status, params
        flash[:notice].should eq("Case #{@case_to_transfer.short_id} invalid transfer, can't update is not in progress or you have not permission on the case")
      end

    end

  end

end
