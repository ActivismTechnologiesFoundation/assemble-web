require 'spec_helper'

describe Event do
  let(:event) { create(:event) }

  describe "#address_object" do 
    it "parses the address object properly" do 
      address_object = event.address_object
      address = event.address.split(",")
 
      Event::ADDRESS_KEYS.each_with_index do |key, i|
        expect(address_object[key]).to eq(address[i])
      end
    end
  end
end
