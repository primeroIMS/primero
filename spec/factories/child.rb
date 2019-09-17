FactoryBot.define do
  factory :child, :traits => [ :model ] do
    unique_identifier { counter.to_s }
    name { "Test Child #{counter}" }
    created_by "test_user"
    owned_by "test_user"
    module_id "primeromodule-cp"
    child_status Record::STATUS_OPEN
    case_id_display "display_1234"

    after(:build) do |child, factory|
      Child.stub(:get).with(child.id).and_return(child)
    end
  end
end