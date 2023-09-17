const mongoose = require('mongoose');
const User = require('./models/users');

require('dotenv').config({path: __dirname + '/.env' });

// Connect to the database
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
mongoose.Promise = global.Promise;

// [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be 
// switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` 
// if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
mongoose.set('strictQuery', true);

async function updatePasswords() {
  // Update passwords to be hased. Unhashed passwords is: password
  try {
    await User.updateMany({}, {$set: {password: "$2a$10$1Jl9hY6NkGj2BbYQqtK0/u8osr3H1U91PqJsL2ZIjJsa6KXM9mMvS"}});
    console.log("Success updating passwords.");
  } catch (err) {
    console.log("Error updating users' passwords");
    console.log(err);
  }
}

updatePasswords();
