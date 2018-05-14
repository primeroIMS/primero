require 'rails_helper'

# class TestClass < CouchRest::Model::Base
#   include Ownable
#   include Alertable
#
#   property :foo
# end

describe Alertable do
  before do
    Child.all.each &:destroy
    # @date_time = DateTime.parse("2016/08/01 12:54:55 -0400")
    # DateTime.stub(:now).and_return(@date_time)
    @user_owner = User.new(user_name: 'Uzer Owner')
    @user_not_owner = User.new(user_name: 'Uzer Not Owner')
    User.stub(:find_by_user_name).and_return(@user_owner)
    User.stub(:find_by_user_name).with('Uzer Not Owner').and_return(@user_not_owner)
  end

  context 'when a transfer_request alert exists' do
    before do
      @case1 = Child.create(name: 'Test Case 1', short_id: 'aaa111', module_id: PrimeroModule::CP,
                            owned_by: @user_owner.user_name,
                            alerts: [Alert.new(type: 'transfer_request', alert_for: 'transfer_request')])
    end

    context 'and current user is not the record owner' do
      before do
        @session = fake_login @user_not_owner
      end

      context 'and the record is edited' do
        before do
          @case1.name = 'Test Case 1 Edited'
          @case1.save
        end

        it 'does not remove the alert' do
          expect()
        end
      end
    end

    context 'and current user is the record owner' do
      before do
        @session = fake_login @user_owner
      end

      context 'and the record is edited' do
        before do
          @case1.name = 'Test Case 1 Edited'
          @case1.save
        end

        it 'removes the alert' do

        end
      end
    end
  end
end