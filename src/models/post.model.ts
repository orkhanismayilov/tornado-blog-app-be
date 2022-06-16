import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Post } from '../interfaces';

const postSchema = new Schema<Post>(
  {
    _id: { type: String, default: uuid },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
  },
  {
    minimize: false,
    timestamps: {},
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        const { FULL_URL } = process.env;
        const { _id, __v, imagePath, ...post } = ret;

        return {
          ...post,
          imagePath: `${FULL_URL}${imagePath}`,
        };
      },
    },
  },
);

postSchema.virtual('id').get(function () {
  return this._id;
});

export const PostModel = model('Post', postSchema);
