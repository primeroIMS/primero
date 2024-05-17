# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Monkeypatch Hash to support deep compaction of nested hashes.
Hash.class_eval do
  def compact_deep
    to_h do |key, value|
      value = if value.nil?
                nil
              elsif value.is_a? Hash
                value.compact_deep
              else
                value
              end
      [key, value]
    end.compact
  end
end
