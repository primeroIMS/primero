require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Transitionable
end

describe Transitionable do
  before do
    @date_time = DateTime.parse("2016/08/01 12:54:55 -0400")
    DateTime.stub(:now).and_return(@date_time)
    @user = User.new(user_name: 'Uzer From')
    @user_to_local = User.new(user_name: 'Uzer To', email: 'uzer_to@test.com', send_mail: true)
    User.stub(:find_by_user_name).with('Uzer From').and_return(@user)
    User.stub(:find_by_user_name).with('Uzer To').and_return(@user_to_local)
    @referral = Transition.new(
                    :type => "referral",
                    :to_user_local => @user_to_local.user_name,
                    :to_user_remote => nil,
                    :to_user_agency => nil,
                    :transitioned_by => @user.user_name,
                    :to_user_local_status => "pending",
                    :notes => "bla bla bla",
                    :is_remote => true,
                    :type_of_export => nil,
                    :service => nil,
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

  it 'has no transitions on start' do
    test = TestClass.new()

    expect(test.transitions.count).to equal(0)
  end

  it 'adds transitions with current time' do
    test = TestClass.new()

    fake_now = DateTime.parse("2016/09/02 20:00:00 -0400")
    DateTime.stub(:now).and_return(fake_now)

    test.add_transition(@referral.type, @referral.to_user_local,
                        @referral.to_user_remote, @referral.to_user_agency,
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @user.user_name, @referral.consent_overridden, false, @referral.service)

    expect(test.transitions.count).to equal(1)
    expect(test.transitions.first.created_at).to eq(fake_now.to_date)
  end

  it 'returns transfers and referrals properly' do
    test = TestClass.new()

    test.add_transition(@referral.type, @referral.to_user_local,
                        @referral.to_user_remote, @referral.to_user_agency,
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @referral.transitioned_by, @referral.consent_overridden, false, @referral.service)
    test.add_transition(@referral.type, @referral.to_user_local, 
                        @referral.to_user_remote, @referral.to_user_agency, 
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @referral.transitioned_by, @referral.consent_overridden, false, @referral.service)
    test.add_transition(@transfer.type, @transfer.to_user_local, 
                        @transfer.to_user_remote, @transfer.to_user_agency,
                        @transfer.notes, @transfer.is_remote, @transfer.type_of_export,
                        @referral.transitioned_by, @transfer.consent_overridden, false, @transfer.service)

    expect(test.transitions.count).to equal(3)
    expect(test.referrals.count).to equal(2)
    expect(test.transfers.count).to equal(1)
  end

  it 'returns services_section_unique_id' do
    test = TestClass.new()
    service_section_unique_id = "c48b55d7-3e1a593"
    test.add_transition(@referral.type, @referral.to_user_local,
                        @referral.to_user_remote, @referral.to_user_agency, @referral.to_user_local_status,
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @referral.transitioned_by, @referral.consent_overridden, false, @referral.service, service_section_unique_id)

    expect(test.referrals.count).to equal(1)
    expect(test.referrals.first.service_section_unique_id).to equal(service_section_unique_id)
  end

  describe "mailer" do
    before do
      ActiveJob::Base.queue_adapter = :inline
      @test_url = "http://test.com"
    end

    context 'when there are no transitions' do
      before do
        @case1 = Child.new()
      end

      it 'does not send a referral email' do
        expect { @case1.send_transition_email(Transition::TYPE_REFERRAL, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'does not send a transfer email' do
        expect { @case1.send_transition_email(Transition::TYPE_TRANSFER, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'does not send a reassign email' do
        expect { @case1.send_transition_email(Transition::TYPE_REASSIGN, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end
    end

    context 'when the last transition is a referral' do
      before do
        @case1 = Child.new(id: '12345')
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

      it 'sends a referral email' do
        expect { @case1.send_transition_email(Transition::TYPE_REFERRAL, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it 'does not send a transfer email' do
        expect { @case1.send_transition_email(Transition::TYPE_TRANSFER, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'does not send a reassign email' do
        expect { @case1.send_transition_email(Transition::TYPE_REASSIGN, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end
    end

    context 'when the last transition is a transfer' do
      before do
        @case1 = Child.new(id: '12345')
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

      it 'sends a transfer email' do
        expect { @case1.send_transition_email(Transition::TYPE_TRANSFER, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it 'does not send a referral email' do
        expect { @case1.send_transition_email(Transition::TYPE_REFERRAL, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'does not send a reassign email' do
        expect { @case1.send_transition_email(Transition::TYPE_REASSIGN, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end
    end

    context 'when the last transition is a reassign' do
      before do
        @case1 = Child.new(id: '12345')
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

      it 'sends a reassign email' do
        expect { @case1.send_transition_email(Transition::TYPE_REASSIGN, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it 'does not send a referral email' do
        expect { @case1.send_transition_email(Transition::TYPE_REFERRAL, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'does not send a transfer email' do
        expect { @case1.send_transition_email(Transition::TYPE_TRANSFER, @test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end
    end
  end
end