require 'rails_helper'

describe Alertable do
  context 'when a transfer_request alert exists' do
    before do
      @test_class = Child.create(name: 'bar',
                                     alerts: [Alertable::Alert.new(type: 'transfer_request', alert_for: 'transfer_request')])
    end

    context 'and current user is not the record owner' do
      before do
        Child.any_instance.stub(:last_updated_by).and_return('not_the_owner')
        Child.any_instance.stub(:owned_by).and_return('the_owner')
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
      end
    end
  end
end