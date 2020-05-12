require 'rails_helper'

describe SqlLogFilter do
  before do
    @column = ActiveRecord::Relation::QueryAttribute.new('test_column', 1, 
        ActiveModel::Type::Integer.new(limit: 4))
  end

  describe '.render_bind' do
    it 'filters predefined columns' do
      log_subscriber = ActiveRecord::LogSubscriber.new
      allow(Rails.application.config).to receive(:filter_parameters).and_return(%w(test_column))
      expect(log_subscriber.render_bind(@column, 1)).to eq(['test_column', '[FILTERED]'])
    end
  end
end