import { Schema, model, models } from "mongoose";


// export interface User extends Document {
//     clerkId: number;
//     email: string;
//     username: string;
//     photo?: image; // 使用之前定义的Image接口，且此字段为可选
//     firstName?: string; // 可选字段
//     lastName?: string; // 可选字段
//     planId?: number; // 可选字段
//     creditBalance?: number; // 可选字段
//   }
  

const userSchema = new Schema({

    clerkId: { type: Number, required: true, unique: true}, //unique用于指定该字段在整个集合中必须是唯一的
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    planId: { type: Number, default: 1 },
    creditBalance: { type: Number, default: 10 }

})

const Users = models?.Users || model("User", userSchema);

export default Users;