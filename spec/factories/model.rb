FactoryBot.define do
  trait :model do
    transient do
      sequence(:counter, 1_000_000)
    end

    _id { "id-#{counter}" }
  end
end