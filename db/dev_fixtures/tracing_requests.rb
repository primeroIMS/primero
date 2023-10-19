# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

{
  'ff837103-455b-4735-9e5c-4ed9atrac001' => lambda do |t|
    t.module_id = 'primeromodule-cp'
  end

}.each do |k, v|
  default_owner = User.find_by_user_name('primero')
  t = TracingRequest.find_by_unique_identifier(k) || TracingRequest.new_with_user_name(default_owner,
                                                                                       { unique_identifier: k })
  v.call(t)
  puts "Tracing Request #{t.new? ? 'created' : 'updated'}: #{t.unique_identifier}"
  t.save!
end
