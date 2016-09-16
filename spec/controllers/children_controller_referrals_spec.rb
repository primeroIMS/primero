require 'spec_helper'

describe ChildrenController do

  before do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}

    permission_transition = Permission.new(resource: Permission::CASE, actions: [Permission::REFERRAL])
    Role.create(id: 'referer', name: 'referer', permissions_list: [permission_transition], group_permission: Permission::GROUP)

    @user = User.new(:user_name => 'referring_user', :role_ids => ['referer'])

    @user2 = User.new(:user_name => 'primero_cp', :role_ids => ['referer'], :module_ids => [PrimeroModule::CP])

    @user3 = User.new(:user_name => 'business_user', :role_ids => ['referer'], :module_ids => [PrimeroModule::CP])

    #Case with no consent for services and no consent for shared.
    @case_no_consent = Child.create(:name => 'No Consent at all', :module_id => PrimeroModule::CP,
      :consent_for_services => false, :disclosure_other_orgs => false, :created_by => @user.user_name)

    #Case with no consent to shared.
    @case_no_consent_to_share = Child.create(:name => 'No Consent to share', :module_id => PrimeroModule::CP,
      :consent_for_services => true, :disclosure_other_orgs => false, :created_by => @user.user_name)

    #Case with no consent to service.
    @case_no_consent_to_service = Child.create(:name => 'No Consent to service', :module_id => PrimeroModule::CP,
      :consent_for_services => false, :disclosure_other_orgs => true, :created_by => @user.user_name)

    @session = fake_login @user
  end

  after do
    Role.all.each{|r| r.destroy}
    User.all.each{|u| u.destroy}
    Child.all.each{|u| u.destroy}
  end

  shared_examples_for "No consent" do
    it "should see error message: referral failed (check that consent fields are selected)" do
      controller.stub :render
      controller.stub :redirect_to

      #This is a referral, referrals need to check if there is a consent about the record
      #So, make sure this code is called with the corresponding instance.
      controller.should_receive(:is_consent_given?).with(instance).and_call_original

      #Call method :is_reassign? when test the authorize and when test the consent.
      controller.should_receive(:is_reassign?).twice.and_call_original

      #Call method :consent_override when test the consent.
      controller.should_receive(:consent_override).and_call_original

      #Records did not pass the consent validation
      #the following methods should not be called.
      controller.should_not_receive(:log_to_history)
      controller.should_not_receive(:is_remote?)
      controller.should_not_receive(:remote_transition)
      controller.should_not_receive(:local_transition)

      #Expected the method given_consent is called to verify if the referrals was granted.
      expect_any_instance_of(Child).to receive(:given_consent).with("referral").and_call_original

      params = {
        :consent_override => "false",
        "selected_records"=>"",
        "transition_type"=>"referral",
        "existing_user"=>existing_user,
        "transition_role"=>"role-referral",
        "other_user_agency"=>"",
        "service"=>"Safehouse Service",
        "notes"=>"This should fails No consent grant",
        "type_of_export"=>"Primero",
        "file_name"=>"",
        "id"=>id
      }
      params["is_remote"] = "true" if remote_referral
      post :transition, params

      #No consent was grant to make a referrals on the record.
      flash[:notice].should eq("Case #{short_id} referral failed (check that consent fields are selected)")

      #No consent was grant, so no referrals records should be created.
      assigns[:record].referrals.should eq([])
    end
  end

  describe "Referrals" do

    context "(unchecked) Do you wish to override this setting?" do

      context "No consent for services and No consent for share" do
        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent}
        end

        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent}
        end
      end

      context "Consent for services and No consent for share" do
        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent_to_share}
        end

        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_share}
        end
      end

      context "No Consent for services and Consent for share" do
        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent_to_service}
        end

        it_behaves_like "No consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_service}
        end
      end

    end

  end

end
