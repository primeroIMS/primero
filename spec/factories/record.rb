FactoryBot.define do
  trait :record do
    transient do
      sequence(:counter, 1_000_000)
    end

    id { "id-#{counter}" }
  end
end