const { Schema, model } = require("mongoose");
const Paginator = require("mongoose-paginate-v2");

const PostSchema = new Schema(
  {
    postImage: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      count: { type: Number, default: 0 },
      user: [
        {
          ref: "users",
          type: Schema.Types.ObjectId,
        },
      ],
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          ref: "users",
          type: Schema.Types.ObjectId,
        },
      },
    ],
    author: {
      ref: "users",
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);


PostSchema.plugin(Paginator);

module.exports = model("posts", PostSchema);