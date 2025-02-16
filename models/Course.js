import mongoose from 'mongoose'; 

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  videos: [String], 
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  topics: { type: [TopicSchema], required: true },
  notes: String,
});

const CourseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true }, 
  courseName: { type: String, required: true },
  credits: { type: Number, required: true },
  description: { type: String, required: true }, 
  resources: [String], 
  playlists: [String], 
  modules: { type: [ModuleSchema], required: true }, 
  DA: { type: String, required: true }, 
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }, 
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;
