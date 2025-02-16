import mongoose from 'mongoose'; 

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  schoolName: {
    type: String,
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);

export default Branch;
