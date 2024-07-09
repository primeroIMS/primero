# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe DuplicateIdAlertable do
  before :each do
    clean_data(Alert, Child)

    SystemSettings.stub(:current).and_return(
      SystemSettings.new(system_options: { duplicate_field_to_form: { case: { field_id: 'form_1' } } })
    )

    @child1 = Child.create!(data: { field_id: '0001' })
  end

  it 'creates a duplicate alert if other record has the same id value' do
    ActiveJob::Base.queue_adapter = :test

    expect { Child.create!(data: { field_id: '0001' }) }.to enqueue_job(DuplicateFieldAlertJob)
  end
end
