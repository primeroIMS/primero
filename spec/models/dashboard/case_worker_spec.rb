require 'rails_helper'

describe Dashboards::CaseWorker, search: true do

  before :each do
    Child.create!(data: { record_state: true, status: 'open' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar' })
    Child.create!(data: { record_state: false, status: 'open' })
    Child.create!(data: { record_state: true, status: 'closed', date_closure: 1.day.ago })
    Child.create!(data: { record_state: true, status: 'closed', date_closure: 2.days.ago })
    Child.create!(data: { record_state: true, status: 'closed', date_closure: 15.days.ago })
    Sunspot.commit
  end

  let(:stats) { Dashboards::CaseWorker.new.stats }

  it 'shows the number of all open cases' do
    expect(stats['open']).to eq(2)
  end

  it 'shows the number of updated cases' do
    expect(stats['updated']).to eq(1)
  end

  it 'shows the number of recently closed cases' do
    expect(stats['closed_recently']).to eq(2)
  end

  after :each do
    Child.destroy_all
    Sunspot.commit
  end

end