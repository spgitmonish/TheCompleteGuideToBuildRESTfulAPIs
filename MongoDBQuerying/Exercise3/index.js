const mongoose = require('mongoose');

// Connect to the collection in the database
mongoose.connect('mongodb://localhost/mongo-exercises');

// Schema representing a course in the collection
const courseSchema = new mongoose.Schema({
  name: String,
  author: String, 
  tags: [ String ],
  date: Date, 
  isPublished: Boolean,
  price: Number
});

// Compile the course model(class) based on the schema
const Course = mongoose.model('Course', courseSchema);

// Asynchronous function to get the results
async function getCourses() {
  // Use the model to query the courses
  const queryResult = await Course
    .find({ isPublished: true })
    .or([ { price: { $gte : 15 } }, 
          { name: { $regex: /.*by.*/ } } ])
    .select({ name: 1, author: 1, price: 1});

  return queryResult;
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();