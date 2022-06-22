const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'nameni kiriting'],
      maxlength: [20, 'maximal 20 ta  harf'],
      minlength: [5, 'minimal 5 ta harf']
    },
    price: {
      type: Number,
      required: true
    },
    priceDiscount: {
      type: Number
    },
    maxGroupSize: {
      type: Number,
      required: true,
      validate: {
        validator: function(val) {
          if (val > 0 && Number.isInteger(val)) {
            return true;
          } else {
            return false;
          }
        },
        message:"siz yomon juda yomon raqam kiritdiz"
      }
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'minimal duration 1'],
      max: [100, 'maximal 10 duration']
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["easy","medium","difficult"],
        message: 'siz xato ma`lumot kiritdiz'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      trim: true,
      required: true
    },
    secretInfo: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    imageCover: {
      type: String
    },
    images: [String],
    startDates: [Date],

    createAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtual: true }
  }
);

tourSchema.virtual('hafta').get(function() {
  return this.duration / 7;
});

tourSchema.pre('save', function(next) {
  this.startTime = Date.now();

  this.name = this.name + 1;
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(Date.now() - doc.startTime);

  next();
});

//Query middleware

tourSchema.pre('find', function(next) {
  this.find({ secretInfo: { $ne: true } });

  next();
});
tourSchema.pre('findOneAndDelete', function(next) {
  this.findOneAndDelete({ secretInfo: { $ne: true } });

  next();
});

//Data Validation:Build And Validators
//Data Validation :Custom validators

const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;
