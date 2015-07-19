module Api
  module V1
    class ZipcodesController < BaseController

    	def validate
 				render json: { valid: Zipcode.exists?(value: params[:zipcode]) }
    	end

    end
  end
end