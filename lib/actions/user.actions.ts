"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase(); //cache connection to database

    const newUser = await User.create(user); //等待User model，创建一个Document，传递前端用户的数据命名为user，数据结构是在CreateUserParams中定义

    return JSON.parse(JSON.stringify(newUser)); //解析内容
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId }); //通过userID读取用户信息

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    //`findOneAndUpdate`是MongoDB的Mongoose库中的一个方法，不是自定义的。
    // 这个方法用来找到一个文档并更新它，可用于操作MongoDB数据库中的数据。
    // 在这个函数中，它被用于根据`clerkId`找到一个用户，并用提供的`user`对象更新该用户。
    // `{new: true}`选项确保方法返回更新后的文档。如果没有找到或更新失败，则抛出错误。

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");
    //这个函数使用`User.findByIdAndDelete`方法来删除指定ID的用户。
    // 这是Mongoose库提供的方法，用于直接根据文档的ID删除该文档。
    // 执行删除操作后，`revalidatePath("/")`可能是用来更新或清理与被删除用户相关的缓存或视图，确保用户界面反映了最新的数据状态。
    // `revalidatePath("/")`在这个上下文中可能指的是一个在数据改变后触发页面或数据的重新验证（revalidation）的过程
    // 告诉框架重新生成静态页面或更新静态生成的内容，确保用户看到的是最新的数据。
    // 这通常用于静态站点生成（SSG）或增量静态重新生成（ISR）的场景，以保持内容的更新性。

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
// export async function updateCredits(userId: string, creditFee: number) {
//   try {
//     await connectToDatabase();

//     const updatedUserCredits = await User.findOneAndUpdate(
//       { _id: userId },
//       { $inc: { creditBalance: creditFee }},
//       { new: true }
//     )

//     if(!updatedUserCredits) throw new Error("User credits update failed");

//     return JSON.parse(JSON.stringify(updatedUserCredits));
//   } catch (error) {
//     handleError(error);
//   }
// }