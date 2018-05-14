require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Ownable
  include Historical
  include Alertable

  property :foo
end

describe Alertable do
  context 'when a transfer_request alert exists' do
    before do
      @test_class = TestClass.create(foo: 'bar',
                                     alerts: [Alert.new(type: 'transfer_request', alert_for: 'transfer_request')])
    end

    context 'and current user is not the record owner' do
      before do
        TestClass.any_instance.stub(:last_updated_by).and_return('not_the_owner')
        TestClass.any_instance.stub(:owned_by).and_return('the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.foo = 'blah'
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
        TestClass.any_instance.stub(:last_updated_by).and_return('the_owner')
        TestClass.any_instance.stub(:owned_by).and_return('the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.foo = 'asdfadfadfa'
          @test_class.save
        end

        it 'removes the alert' do
          expect(@test_class.alerts).not_to be_present
        end
      end
    end
  end
end