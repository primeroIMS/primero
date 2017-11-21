require 'rails_helper'

describe CouchChangesController do
  it 'notifies observers on the given model class' do
    id = '4'
    Child.should_receive(:notify_observers) do |*args|
      Child.changed?.should be_true
    end

    get :notify, :id => id, :deleted => 'false', :models_changed => ['Child']
  end

  xit 'notifies of deleted when present as string "true"' do
    Child.should_receive(:notify_observers).with('1', true)
    get :notify, :id => '1', :deleted => 'true', :model_name => 'Child'
  end

  it 'returns error if model_name is not valid' do
    get :notify, :id => '1', :models_changed => ['NonExistantModel'], :deleted => 'false'
    response.status.should == 404
    JSON.parse(response.body).should == {'error' => 'Model not found: NonExistantModel'}
  end
end

