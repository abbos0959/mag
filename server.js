const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = async (req, res) => {
  try {
    await mongoose.connect(process.env.DATABASE,  { useNewUrlParser: true },
      ()=>{console.log("mongodb ulandi");}
    )
  } catch (error) {
    console.log('mongo ulanmadi');
  }
};
DB();

const port = process.env.PORT || 8000;
app.listen(port,"127.0.0.2", () => {
  console.log(`server ishga tushdi ${port}...`);
});
