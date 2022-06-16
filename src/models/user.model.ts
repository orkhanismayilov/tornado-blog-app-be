import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { v4 as uuid } from 'uuid';

import { User } from '../interfaces';

const userSchema = new Schema<User>(
  {
    _id: { type: String, default: uuid },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    password: { type: String, required: true },
  },
  {
    minimize: false,
    timestamps: {},
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        const { _id, __v, password, ...user } = ret;
        return user;
      },
    },
  },
);

userSchema.virtual('id').get(function () {
  return this._id;
});
userSchema.plugin(uniqueValidator, {
  message: 'User with email {VALUE} already exists!',
});

export const UserModel = model('User', userSchema);
