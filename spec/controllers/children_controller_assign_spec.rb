require 'spec_helper'

describe ChildrenController do

  before do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}

    permission_transition = Permission.new(resource: Permission::CASE, actions: [Permission::REASSIGN, Permission::READ, Permission::WRITE, Permission::CREATE])
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

    @case_to_transfer = Child.new(:name => 'Juan Perez', :module_id => PrimeroModule::CP,
      :consent_for_services => true, :disclosure_other_orgs => true, :created_by => @user.user_name, :last_updated_by => @user.user_name)
    @case_to_transfer.owner = @user
    @case_to_transfer.owned_by = @user.user_name
    @case_to_transfer.save!

    @case_to_transfer_2 = Child.new(:name => 'Juana Perez', :module_id => PrimeroModule::CP,
      :consent_for_services => false, :disclosure_other_orgs => false, :created_by => @user2.user_name, :last_updated_by => @user2.user_name)
    @case_to_transfer_2.assigned_user_names = [@user.user_name]
    @case_to_transfer_2.owner = @user2
    @case_to_transfer_2.owned_by = @user2.user_name
    @case_to_transfer_2.save!
  end

  after do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}
  end

  shared_examples_for "Assign" do
    it "should create the transfers record and set the new owner" do
      @session = fake_login @user

      controller.stub :render
      controller.stub :redirect_to

      controller.should_not_receive(:is_consent_given?)
      controller.should_receive(:is_reassign?).exactly(6).times.and_call_original
      controller.should_receive(:consent_override).and_call_original
      controller.should_receive(:log_to_history).with([instance]).and_call_original
      controller.should_receive(:is_remote?).exactly(4).times.and_call_original
      controller.should_not_receive(:remote_transition)
      controller.should_receive(:local_transition).with([instance]).and_call_original

      params = {
        :consent_override => "false",
        "selected_records"=>"",
        "transition_type"=>"reassign",
        "existing_user"=>existing_user,
        "transition_role"=>"role-transfer",
        "other_user_agency"=>"",
        "notes"=>"Successfully reassigned",
        "type_of_export"=>Transitionable::EXPORT_TYPE_PRIMERO,
        "file_name"=>"",
        "is_remote"=>false,
        "id"=>id
      }

      post :transition, params

      flash[:notice].should eq("Case #{instance.short_id} successfully transferred")
      assigns[:records].should eq([instance])

      child_transferred = Child.get(instance.id)
      child_transferred.transfer_status.should eq(nil)
      child_transferred.owned_by.should eq(existing_user)
      child_transferred.previously_owned_by.should eq(previously_owned_by)
      child_transferred.assigned_user_names.should eq(assigned_user_names)

      transfers = child_transferred.transitions.select{|t| t.type == 'reassign'}
      transfers.size.should eq(1)

      transfer = transfers.first
      transfer.to_user_local.should eq(existing_user)
      transfer.to_user_remote.should eq("")
      transfer.to_user_agency.should eq("")
      transfer.to_user_local_status.should eq("")
      transfer.notes.should eq("Successfully reassigned")
      transfer.transitioned_by.should eq(@user.user_name)
      transfer.service.should eq("")
      transfer.is_remote.should eq(false)
      transfer.type_of_export.should eq(Transitionable::EXPORT_TYPE_PRIMERO)
      transfer.consent_overridden.should eq(false)
    end

  end

  it_behaves_like "Assign" do
    let(:id) {@case_to_transfer.id}
    let(:instance) {@case_to_transfer}
    let(:existing_user) {@user3.user_name}
    let(:previously_owned_by) {@user.user_name}
    let(:assigned_user_names) {[]}
  end

  it_behaves_like "Assign" do
    let(:id) {@case_to_transfer_2.id}
    let(:instance) {@case_to_transfer_2}
    let(:existing_user) {@user3.user_name}
    let(:previously_owned_by) {@user2.user_name}
    let(:assigned_user_names) {[@user.user_name]}
  end

end
