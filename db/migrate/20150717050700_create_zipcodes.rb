class CreateZipcodes < ActiveRecord::Migration
  def change
    create_table :zipcodes do |t|
      t.string :value

      t.timestamps
    end

    add_index :zipcodes, :value, :unique => true
  end
end
