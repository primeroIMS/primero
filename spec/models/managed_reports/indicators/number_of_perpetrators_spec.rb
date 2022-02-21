# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::NumberOfPerpetrators do
  before do
    clean_data(Incident)

    Incident.create!(alleged_perpetrator:
      [
        { unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea10' },
        { unique_id: '11cfd918-3c69-4baa-b1cc-6c9a1cd9ea11' }
      ])
    Incident.create!(alleged_perpetrator: [{ unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' }])
    Incident.create!(alleged_perpetrator: [{ unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' }])
    Incident.create!(alleged_perpetrator:
      [
        { unique_id: '11cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' },
        { unique_id: '12cfd918-3c69-4baa-b1cc-6c9a1cd9ea15' },
        { unique_id: '13cfd918-3c69-4baa-b1cc-6c9a1cd9ea15' }
      ])
  end

  it 'returns the number of incidents grouped by number of perpetrators' do
    data = ManagedReports::Indicators::NumberOfPerpetrators.build.data

    expect(data).to match_array(
      [
        { 'id' => 'equal_to_1', 'total' => 2 },
        { 'id' => 'equal_to_2', 'total' => 1 },
        { 'id' => 'equal_to_3', 'total' => 1 }
      ]
    )
  end
end
