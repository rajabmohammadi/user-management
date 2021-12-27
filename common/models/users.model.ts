import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
const Mixed = mongoose.Schema.Types.Mixed;

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    permissionFlags: Number,
  },
  { timestamps: true }
);
export default mongoose.model('users', UserSchema);