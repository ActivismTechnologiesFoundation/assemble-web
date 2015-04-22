class CreateApiKeys < ActiveRecord::Migration
  def change
    create_table :api_keys do |t|
      t.string :app_id
      t.index :app_id, unique: true

      t.timestamps
    end
  end
end
