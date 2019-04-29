require 'rails_helper'

describe NotificationMailer, :type => :mailer do
  describe "approvals" do
    before do
      Lookup.all.each {|lookup| lookup.destroy}
      User.all.each {|user| user.destroy}
      @lookup = create :lookup, id: 'lookup-approval-type', name: 'approval type'
      @manager1 = create :user, is_manager: true, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
      @manager2 = create :user, is_manager: true, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
      @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
      @child = child_with_created_by(@owner.user_name, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345')
    end

    describe "manager_approval_request" do
      let(:mail) { NotificationMailer.manager_approval_request(@owner.id, @manager2.id, @child.id, 'value1', 'example.com') }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Request")
        expect(mail.to).to eq(["manager2@primero.dev"])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("The user jnelson is requesting approval for value1 on case .*#{@child.short_id}")
      end
    end

    describe "manager_approval_response" do
      let(:mail) { NotificationMailer.manager_approval_response(@manager1.id, @child.id, 'value1', true, 'example.com', false) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Response")
        expect(mail.to).to eq(["owner@primero.dev"])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("manager1 has rejected the request for approval for value1 for case .*#{@child.short_id}")
      end
    end
  end

  describe "transitions" do
    before do
      Lookup.all.each &:destroy
      Lookup.create(id: "lookup-service-type", name: "Service Type",
          lookup_values: [{id: "safehouse_service", display_text: "Safehouse Service"}.with_indifferent_access,
                          {id: "health_medical_service", display_text: "Health/Medical Service"}.with_indifferent_access]
      )

      @test_url = "http://test.com"
      @date_time = DateTime.parse("2016/08/01 12:54:55 -0400")
      DateTime.stub(:now).and_return(@date_time)
      @user = User.new(user_name: 'Uzer From')
      @user_to_local = User.new(user_name: 'Uzer To', email: 'uzer_to@test.com', send_mail: true)
      User.stub(:find_by_user_name).with('Uzer From').and_return(@user)
      User.stub(:find_by_user_name).with('Uzer To').and_return(@user_to_local)
      @agency = Agency.new(name: 'Test Agency')
      User.any_instance.stub(:agency).and_return(@agency)
      @referral = Transition.new(
          :type => "referral",
          :to_user_local => @user_to_local.user_name,
          :to_user_remote => nil,
          :to_user_agency => nil,
          :transitioned_by => @user.user_name,
          :notes => "bla bla bla",
          :is_remote => true,
          :type_of_export => nil,
          :service => 'safehouse_service',
          :consent_overridden => true,
          :created_at => DateTime.now)
      @transfer = Transition.new(
          :type => "transfer",
          :to_user_local => @user_to_local.user_name,
          :to_user_remote => nil,
          :to_user_agency => nil,
          :transitioned_by => @user.user_name,
          :notes => "aha!",
          :is_remote => true,
          :type_of_export => nil,
          :service => nil,
          :consent_overridden => true,
          :created_at => DateTime.now)
      @reassign = Transition.new(
          :type => "reassign",
          :to_user_local => @user_to_local.user_name,
          :to_user_remote => nil,
          :to_user_agency => nil,
          :transitioned_by => @user.user_name,
          :notes => "yo yo yo",
          :is_remote => false,
          :type_of_export => nil,
          :service => nil,
          :consent_overridden => true,
          :created_at => DateTime.now)
    end

    describe "referral" do
      before do
        @case1 = Child.new(id: '12345', short_id: 'short_123')
        @case1.add_transition(@transfer.type, @transfer.to_user_local,
                              @transfer.to_user_remote, @transfer.to_user_agency, @referral.to_user_local_status,
                              @transfer.notes, @transfer.is_remote, @transfer.type_of_export,
                              @referral.transitioned_by, @transfer.consent_overridden, false, @transfer.service)
        @case1.add_transition(@referral.type, @referral.to_user_local,
                              @referral.to_user_remote, @referral.to_user_agency, @referral.to_user_local_status,
                              @referral.notes, @referral.is_remote, @referral.type_of_export,
                              @referral.transitioned_by, @referral.consent_overridden, false, @referral.service)
        Child.stub(:get).with('12345').and_return(@case1)
      end

      let(:mail) { NotificationMailer.transition_notify(Transition::TYPE_REFERRAL, 'Child', @case1.id, @case1.transitions.first.id, @test_url) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case1.short_id} - Referral")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("Uzer From from Test Agency has referred the following Case to you: (.*short_123)(.*for Safehouse Service).")
      end
    end

    describe "transfer" do
      before do
        @case1 = Child.new(id: '12345', short_id: 'short_123')
        @case1.add_transition(@referral.type, @referral.to_user_local,
                              @referral.to_user_remote, @referral.to_user_agency, @referral.to_user_local_status,
                              @referral.notes, @referral.is_remote, @referral.type_of_export,
                              @referral.transitioned_by, @referral.consent_overridden, false, @referral.service)
        @case1.add_transition(@transfer.type, @transfer.to_user_local,
                              @transfer.to_user_remote, @transfer.to_user_agency, @referral.to_user_local_status,
                              @transfer.notes, @transfer.is_remote, @transfer.type_of_export,
                              @referral.transitioned_by, @transfer.consent_overridden, false, @transfer.service)
        Child.stub(:get).with('12345').and_return(@case1)
      end

      let(:mail) { NotificationMailer.transition_notify(Transition::TYPE_TRANSFER, 'Child', @case1.id, @case1.transitions.first.id, @test_url) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case1.short_id} - Transfer")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("Uzer From has transferred the following Case to you: .*#{@case1.short_id}.")
      end
    end

    describe "reassign" do
      before do
        @case1 = Child.new(id: '12345', short_id: 'short_123')
        @case1.add_transition(@referral.type, @referral.to_user_local,
                              @referral.to_user_remote, @referral.to_user_agency, @referral.to_user_local_status,
                              @referral.notes, @referral.is_remote, @referral.type_of_export,
                              @referral.transitioned_by, @referral.consent_overridden, false, @referral.service)
        @case1.add_transition(@transfer.type, @transfer.to_user_local,
                              @transfer.to_user_remote, @transfer.to_user_agency, @referral.to_user_local_status,
                              @transfer.notes, @transfer.is_remote, @transfer.type_of_export,
                              @referral.transitioned_by, @transfer.consent_overridden, false, @transfer.service)
        @case1.add_transition(@reassign.type, @reassign.to_user_local,
                              @reassign.to_user_remote, @reassign.to_user_agency, @referral.to_user_local_status,
                              @reassign.notes, @reassign.is_remote, @reassign.type_of_export,
                              @referral.transitioned_by, @reassign.consent_overridden, false, @reassign.service)
        Child.stub(:get).with('12345').and_return(@case1)
      end

      let(:mail) { NotificationMailer.transition_notify(Transition::TYPE_REASSIGN, 'Child', @case1.id, @case1.transitions.first.id, @test_url) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case1.short_id} - Assigned to you")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("Uzer From has assigned the following Case to you: .*#{@case1.short_id}.")
      end
    end
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    child = Child.new_with_user_name user, options
    child.save
  end
end
