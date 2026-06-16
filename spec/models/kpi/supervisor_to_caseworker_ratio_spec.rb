# frozen_string_literal: true

require 'rails_helper'

describe Kpi::SupervisorToCaseworkerRatio do
  include FormAndFieldHelper
  include SunspotHelper

  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  before :each do
    clean_data
  end

  after :each do
    clean_data
  end
end
