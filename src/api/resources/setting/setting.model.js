import mongoose from 'mongoose';

const { Schema } = mongoose;
const settingSchema = new Schema({
  item_per_page: {
    type: Number
  },
  format_date: {
    type: String
  },
  total_images: {
    type: Number
  },
  total_files: {
    type: Number
  },
  google_key: {
    type: String
  }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
export default mongoose.model('Setting', settingSchema);
