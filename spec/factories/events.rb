FactoryGirl.define do
  factory :event do
    name Faker::Lorem.word
    topic Faker::Lorem.word
    description Faker::Lorem.paragraph
    address "#{Faker::Address.street_address},#{Faker::Address.city},#{Faker::Address.state_abbr},#{Faker::Address.zip}"
    url Faker::Internet.url
    starts_at Time.parse("2015-04-04 11:20:00")
    ends_at Time.parse("2015-04-04 21:20:00")
  end
end
