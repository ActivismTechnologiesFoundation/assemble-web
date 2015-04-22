class ApiKey < ActiveRecord::Base
  before_create :generate_app_id

  private 
    def generate_app_id
      return unless self.app_id.blank?
      begin
        self.app_id = SecureRandom.hex
      end while ApiKey.exists?(app_id: app_id)
    end
end
