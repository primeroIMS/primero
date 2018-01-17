require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Transitionable
end

describe Transitionable do
  before do
    @date_time = DateTime.parse("2016/08/01 12:54:55 -0400")
    DateTime.stub(:now).and_return(@date_time)
    @user_name = "James Bond"
    @referral = Transition.new(
                    :type => "referral",
                    :to_user_local => nil,
                    :to_user_remote => nil,
                    :to_user_agency => nil,
                    :transitioned_by => @user_name,
                    :notes => "bla bla bla",
                    :is_remote => true,
                    :type_of_export => nil,
                    :service => nil,
                    :consent_overridden => true,
                    :created_at => DateTime.now)
    @transfer = Transition.new(
                    :type => "transfer",
                    :to_user_local => nil,
                    :to_user_remote => nil,
                    :to_user_agency => nil,
                    :transitioned_by => @user_name,
                    :notes => "aha!",
                    :is_remote => true,
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
                        @user_name, @referral.consent_overridden, @referral.service)

    expect(test.transitions.count).to equal(1)
    expect(test.transitions.first.created_at).to eq(fake_now.to_date)
  end

  it 'returns transfers and referrals properly' do
    test = TestClass.new()

    test.add_transition(@referral.type, @referral.to_user_local,
                        @referral.to_user_remote, @referral.to_user_agency,
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @user_name, @referral.consent_overridden, @referral.service)
    test.add_transition(@referral.type, @referral.to_user_local,
                        @referral.to_user_remote, @referral.to_user_agency,
                        @referral.notes, @referral.is_remote, @referral.type_of_export,
                        @user_name, @referral.consent_overridden, @referral.service)
    test.add_transition(@transfer.type, @transfer.to_user_local,
                        @transfer.to_user_remote, @transfer.to_user_agency,
                        @transfer.notes, @transfer.is_remote, @transfer.type_of_export,
                        @user_name, @transfer.consent_overridden, @transfer.service)

    expect(test.transitions.count).to equal(3)
    expect(test.referrals.count).to equal(2)
    expect(test.transfers.count).to equal(1)
  end
end