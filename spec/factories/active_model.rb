FactoryBot.define do
  trait :active_model do
    transient do
      sequence(:counter, 1_000_000)
    end

    id { counter }
  end
end