require 'rails_helper'

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

    User.stub(:find_by_user_name).with(@user.user_name).and_return(@user)
    User.stub(:find_by_user_name).with(@user2.user_name).and_return(@user2)
    User.stub(:find_by_user_name).with(@user3.user_name).and_return(@user3)

    #Case with no consent for services and no consent for shared.
    @case_no_consent = Child.create(:name => 'No Consent at all', :module_id => PrimeroModule::CP,
      :consent_for_services => false, :disclosure_other_orgs => false, :created_by => @user.user_name, :last_updated_by => @user.user_name)

    #Case with no consent to shared.
    @case_no_consent_to_share = Child.create(:name => 'No Consent to share', :module_id => PrimeroModule::CP,
      :consent_for_services => true, :disclosure_other_orgs => false, :created_by => @user.user_name, :last_updated_by => @user.user_name)

    #Case with no consent to service.
    @case_no_consent_to_service = Child.create(:name => 'No Consent to service', :module_id => PrimeroModule::CP,
      :consent_for_services => false, :disclosure_other_orgs => true, :created_by => @user.user_name, :last_updated_by => @user.user_name)

    #Case with consent for services and consent for shared.
    @case_consent = Child.create(:name => 'Consent all', :module_id => PrimeroModule::CP,
      :consent_for_services => true, :disclosure_other_orgs => true, :created_by => @user.user_name, :last_updated_by => @user.user_name)

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
        "type_of_export"=>Transitionable::EXPORT_TYPE_PRIMERO,
        "file_name"=>"",
        "id"=>id
      }
      params["is_remote"] = "true" if remote_referral
      post :transition, params

      #No consent was grant to make a referrals on the record.
      flash[:notice].should eq("Case #{short_id} referral failed (check that consent fields are selected)")

      #No consent was grant, so no referrals records should be created.
      assigns[:record].referrals.should eq([])
      Child.get(instance.id).referrals.should eq([])
      #No consent was grant, no record was selected.
      assigns[:records].should eq([])
    end
  end

  shared_examples_for "Consent" do
    it "successfully referred" do
      controller.stub :render
      controller.stub :redirect_to

      #This is a referral, referrals need to check if there is a consent about the record
      #So, make sure this code is called with the corresponding instance.
      controller.should_receive(:is_consent_given?).with(instance).and_call_original

      #Call method :consent_override when test the consent and when create the history.
      controller.should_receive(:consent_override).twice.and_call_original

      #Expected the method given_consent is called to verify if the referrals was granted.
      expect_any_instance_of(Child).to receive(:given_consent).with("referral").and_call_original

      #User is overriding the consent, so even the records has no consent grant
      #It will be referred. So the next senteces will be called.

      controller.should_receive(:log_to_history).with([instance]).and_call_original
      controller.should_receive(:is_remote?).exactly(4).times.and_call_original

      if remote_referral
        controller.should_not_receive(:local_transition)
        controller.should_receive(:remote_transition).with([instance]).and_call_original
        controller.should_receive(:message_success_transition).with([instance].size).and_call_original
        controller.should_receive(:is_reassign?).twice.and_call_original
      else
        controller.should_not_receive(:remote_transition)
        controller.should_receive(:local_transition).with([instance]).and_call_original
        controller.should_receive(:is_reassign?).exactly(3).times.and_call_original
      end

      params = {
        "selected_records"=>"",
        "transition_type"=>"referral",
        "transition_role"=>"role-referral",
        "other_user_agency"=>"",
        "service"=>"safehouse_service",
        "notes"=>"Cases Referred Successfully.",
        "file_name"=>"",
        "id"=>id
      }

      params["consent_override"] = if defined?(consent_override)
        consent_override.to_s
      else
        "true"
      end

      params["type_of_export"] = if defined?(type_of_export)
        type_of_export
      else
        Transitionable::EXPORT_TYPE_PRIMERO
      end

      if remote_referral
        #Remote referrals must pass the "other_user" params.
        params["other_user"] = other_user
        params["is_remote"] = "true"
        params["password"] = "password"
      else
        #Local referrals must pass the "existing_user" params.
        params["existing_user"] = existing_user
      end

      #There is other test testing this.
      if params["type_of_export"] == Transitionable::EXPORT_TYPE_PDF
        Exporters::PDFExporter.stub :export
        controller.stub :filename
        controller.stub :encrypt_data_to_zip
      end

      post :transition, params

      #Consent override is true, so even the case has no consent this will be done anyway.
      flash[:notice].should eq("Case #{short_id} successfully referred")
      assigns[:records].should eq([instance])

      child_referred = Child.get(instance.id)
      referrals = child_referred.referrals
      referrals.size.should eq(1)

      referral = referrals.first
      referral.type.should eq("referral")

      if remote_referral
        referral.to_user_local_status.should eq("")
        referral.to_user_local.should eq("")
        referral.to_user_remote.should eq(other_user)

        assigns["password"].should eq("password")
        assigns["type_of_export_exporter"].should eq(Exporters::JSONExporter) if params["type_of_export"] == Transitionable::EXPORT_TYPE_PRIMERO
        assigns["type_of_export_exporter"].should eq(Exporters::CSVExporter) if params["type_of_export"] == Transitionable::EXPORT_TYPE_NON_PRIMERO
        assigns["type_of_export_exporter"].should eq(Exporters::PDFExporter) if params["type_of_export"] == Transitionable::EXPORT_TYPE_PDF
      else
        referral.to_user_local_status.should eq(Transition::TO_USER_LOCAL_STATUS_INPROGRESS)
        referral.to_user_local.should eq(existing_user)
        referral.to_user_remote.should eq("")
      end

      #This is the user that log in. Change according.
      referral.transitioned_by.should eq(@user.user_name)

      referral.to_user_agency.should eq("")
      referral.notes.should eq("Cases Referred Successfully.")
      referral.service.should eq("safehouse_service")
      referral.is_remote.should eq(remote_referral)
      referral.type_of_export.should eq(params["type_of_export"])

      if child_referred.consent_for_services && child_referred.disclosure_other_orgs
        #When the cases grant the consent, this will be false even the override settings.
        referral.consent_overridden.should eq(false)
      else
        referral.consent_overridden.to_s.should eq(params["consent_override"])
      end

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

      context "Consent for services and Consent for share" do
        it_behaves_like "Consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_consent.short_id}
          let(:id) {@case_consent.id}
          let(:remote_referral) {false}
          let(:instance) {@case_consent}
          let(:consent_override) {false}
        end
      end

    end

    context "(checked) Do you wish to override this setting?" do

      context "No consent for services and No consent for share" do
        it_behaves_like "Consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_NON_PRIMERO}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent.short_id}
          let(:id) {@case_no_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_PDF}
        end
      end

      context "Consent for services and No consent for share" do
        it_behaves_like "Consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent_to_share}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_share}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_share}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_NON_PRIMERO}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_share.short_id}
          let(:id) {@case_no_consent_to_share.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_share}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_PDF}
        end
      end

      context "No Consent for services and Consent for share" do
        it_behaves_like "Consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {false}
          let(:instance) {@case_no_consent_to_service}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_service}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_service}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_NON_PRIMERO}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_no_consent_to_service.short_id}
          let(:id) {@case_no_consent_to_service.id}
          let(:remote_referral) {true}
          let(:instance) {@case_no_consent_to_service}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_PDF}
        end
      end

      context "Consent for services and Consent for share" do
        it_behaves_like "Consent" do
          let(:existing_user) {@user2.user_name}
          let(:short_id) {@case_consent.short_id}
          let(:id) {@case_consent.id}
          let(:remote_referral) {false}
          let(:instance) {@case_consent}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_consent.short_id}
          let(:id) {@case_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_consent}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_consent.short_id}
          let(:id) {@case_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_consent}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_NON_PRIMERO}
        end

        it_behaves_like "Consent" do
          let(:other_user) {@user3.user_name}
          let(:short_id) {@case_consent.short_id}
          let(:id) {@case_consent.id}
          let(:remote_referral) {true}
          let(:instance) {@case_consent}
          let(:type_of_export) {Transitionable::EXPORT_TYPE_PDF}
        end
      end

    end

  end

end
