FactoryGirl.define do
  trait :model do
    ignore do
      sequence(:counter, 1_000_000)
    end

    _id { "id-#{counter}" }
  end
end