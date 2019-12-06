require 'rails_helper'

describe Alertable do
  context 'when a transfer_request alert exists' do
    before do
      role = Role.create!(
        name: 'Test Role 1',
        unique_id: 'test-role-1',
        permissions: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [Permission::MANAGE]
          )
        ]
      )
      agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @user_1 = User.create!(
        full_name: 'Test User 1',
        user_name: 'test_user_1',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'test_user_1@localhost.com',
        agency_id: agency_1.id,
        role: role
      )
      @test_class = Child.create(
        name: 'bar',
        data: { owned_by: @user_1.user_name },
        alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id)]
      )
    end

    context 'and current user is not the record owner' do
      before do
        Child.any_instance.stub(:last_updated_by).and_return('not_the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.name = 'blah'
          @test_class.save
        end

        it 'does not remove the alert' do
          expect(@test_class.alerts).to be_present
          expect(@test_class.alerts.first.type).to eq('transfer_request')
        end

        it 'count alerts by record' do
          expect(@test_class.alert_count).to eq(1)
        end

        it 'count alerts by user' do
          expect(Child.alert_count(@user_1)).to eq(1)
        end
      end
    end

    context 'and current user is the record owner' do
      before do
        Child.any_instance.stub(:last_updated_by).and_return('the_owner')
        Child.any_instance.stub(:owned_by).and_return('the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.name = 'asdfadfadfa'
          @test_class.save
        end

        it 'removes the alert' do
          expect(@test_class.alerts).not_to be_present
        end

        it 'count alerts by record' do
          expect(@test_class.alert_count).to eq(0)
        end

        it 'count alerts by user' do
          expect(Child.alert_count(@user_1)).to eq(0)
        end
      end
    end
  end

  after :each do
    Role.destroy_all
    Agency.destroy_all
    User.destroy_all
    Child.destroy_all
    Alert.destroy_all
  end

end