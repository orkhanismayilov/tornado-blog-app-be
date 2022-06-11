const mongoose = require('mongoose');
const uuid = require('uuid').v4;
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
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

userSchema.virtual('id').get(() => this._id);
userSchema.plugin(uniqueValidator, { message: 'User with email {VALUE} already exists!' });

module.exports = mongoose.model('User', userSchema);
