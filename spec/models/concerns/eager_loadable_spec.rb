# frozen_string_literal: true

require 'active_support'
require 'active_support/core_ext/class/attribute'
require_relative '../../../app/models/concerns/eager_loadable'

describe EagerLoadable do
  let(:record_class) do
    Class.new do
      include EagerLoadable

      def self.includes(associations)
        associations
      end
    end
  end

  it 'keeps the default associations without additional declarations' do
    expect(record_class.eager_loaded_class).to eq(
      [:alerts, :active_flags, { attachments: { file_attachment: :blob },
                                 signatures: { file_attachment: :blob },
                                 current_photos: { file_attachment: :blob } }]
    )
  end

  it 'adds single, multiple, array and nested associations across declarations' do
    record_class.eager_load_associations :registry_records
    record_class.eager_load_associations :family, [:incidents], traces: :matched_case

    expect(record_class.eager_loaded_class).to eq(
      [:alerts, :active_flags, { attachments: { file_attachment: :blob },
                                 signatures: { file_attachment: :blob },
                                 current_photos: { file_attachment: :blob } },
       :registry_records, :family, :incidents, { traces: :matched_case }]
    )
  end

  it 'keeps subclass declarations separate from the parent and siblings' do
    record_class.eager_load_associations :family
    subclass = Class.new(record_class)
    sibling = Class.new(record_class)
    subclass.eager_load_associations :registry_records

    expect(subclass.additional_eager_loaded_classes).to eq(%i[family registry_records])
    expect(record_class.additional_eager_loaded_classes).to eq([:family])
    expect(sibling.additional_eager_loaded_classes).to eq([:family])
  end
end
