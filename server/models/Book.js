import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    
    googleId: {
      type: String,
      required: true
    },
    
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    
    authors: {
      type: [String],
      default: ['Unknown Author']
    },
    
    description: {
      type: String,
      default: 'No description available'
    },
    
    thumbnail: {
      type: String,
      default: ''
    },
    
    link: {
      type: String,
      default: ''
    },
    
    status: {
      type: String,
      enum: ['Want to Read', 'Reading', 'Completed'],
      default: 'Want to Read'
    },
    
    personalReview: {
      type: String,
      default: '',
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({ user: 1, googleId: 1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;