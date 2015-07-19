class AddZipcodeToEvents < ActiveRecord::Migration
  def change
    add_column :events, :zipcode, :string
  end
end
