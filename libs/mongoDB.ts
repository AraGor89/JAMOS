// import mongoose from "mongoose";

// const url = process.env.MONGODB_URI as string;
// let connection: typeof mongoose;

// const connectMongodb = async () => {
//   try {
//     if (!connection) {
//       connection = await mongoose.connect(url);
//       return connection;
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export default connectMongodb;

import mongoose from "mongoose";

const url = process.env.MONGODB_URI as string;
let connection: typeof mongoose;

const connectMongodb = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log("error", error);
  }
};

export default connectMongodb;
