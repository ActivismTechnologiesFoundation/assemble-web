class Event < ActiveRecord::Base
  
  ADDRESS_KEYS = [:line1, :line2, :city, :state, :zipcode]

  def address_object
    keys = ADDRESS_KEYS
    values = address.split(",")
    Hash[keys.zip(values)]
  end
end
