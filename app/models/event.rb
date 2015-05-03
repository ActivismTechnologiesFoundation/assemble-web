class Event < ActiveRecord::Base
  has_and_belongs_to_many :topics
  
  ADDRESS_KEYS = [:line1, :line2, :city, :state, :zipcode]

  def address_object
    keys = ADDRESS_KEYS
    values = address.split(",")
    Hash[keys.zip(values)]
  end
end
