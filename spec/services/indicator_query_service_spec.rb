require 'rails_helper'

describe IndicatorQueryService, search: true do
  before :each do
    foo = User.new(user_name: 'foo')
    foo.save(validate: false)
    bar = User.new(user_name: 'bar')
    bar.save(validate: false)


    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar', workflow: 'assessment' })
    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 1.day.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 2.days.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 15.days.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar', workflow: 'new' })

    Sunspot.commit
  end

  let(:stats) do
    indicators = Dashboard::CASE_OVERVIEW.indicators + Dashboard::WORKFLOW.indicators + Dashboard::WORKFLOW_TEAM.indicators
    IndicatorQueryService.query(indicators, nil)
  end

  it 'shows the number of all open cases' do
    expect(stats['case']['open']['open']).to eq(2)
  end

  it 'shows the number of updated cases' do
    expect(stats['case']['updated']['updated']).to eq(1)
  end

  it 'shows the number of recently closed cases' do
    expect(stats['case']['closed_recently']['closed_recently']).to eq(2)
  end

  it 'shows the workflows breakdown' do
    expect(stats['case']['workflow']['new']).to eq(1)
    expect(stats['case']['workflow']['assessment']).to eq(1)
    expect(stats['case']['workflow']['closed']).to eq(0)
  end

  it 'shows the team workflow breakdown' do
    expect(stats['case']['workflow_team']['foo']['new']).to eq(1)
    expect(stats['case']['workflow_team']['foo']['assessment']).to eq(1)
    expect(stats['case']['workflow_team']['bar']['new']).to eq(1)
    expect(stats['case']['workflow_team']['bar']['assessment']).to eq(0)
  end

  after :each do
    User.destroy_all
    Child.destroy_all
    Sunspot.commit
  end

end