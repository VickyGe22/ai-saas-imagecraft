import { Document, Schema, model, models } from "mongoose";
// Schema：是一个构造函数，用于定义MongoDB集合中文档的结构（schema）。通过指定字段名和字段类型，你可以定义存储在文档中的数据的形状。
// model：是一个函数，用于将定义好的Schema转换为一个可以与数据库进行交互的模型。模型的名字（在这个例子中是'Image'）是该模型对应的集合名的单数形式。Mongoose会自动查找该名称的复数形式的集合。如果集合不存在，Mongoose会创建它。
// models：是一个对象，存储所有已经通过mongoose.model定义的模型。这可以用来防止在热重载（如在开发模式下）时多次编译模型。

export interface PicImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureUrl: string; // URL represented as string
    width?: number; // Optional because not marked as required
    height?: number; // Optional because not marked as required
    config?: object; // Optional and general object type
    transformationUrl?: string; // URL represented as string, optional
    aspectRatio?: string; // Optional because not marked as required
    color?: string; // Optional because not marked as required
    prompt?: string; // Optional because not marked as required
    author: {
        _id:string; 
        firstName: string;
        lastName: string;
    }; // Representing the ObjectId as string
    createdAt?: Date; // Optional because it has a default value
    updatedAt?: Date; // Optional because it has a default value
  }

//如果你有一个用户模型，并且你想在这个模型上添加一些特定的方法或者虚拟属性
//你可能会定义一个接口来扩展基本的Mongoose文档类型，并且添加你自己的方法声明
//类型安全：使用TypeScript接口可以提高类型安全。你可以得到编译时错误提示，减少运行时错误的可能性。
// 代码组织：使用接口可以更好地组织和管理代码，尤其是在大型项目中。它允许你在不同的地方重用相同的类型定义，提高代码的可维护性。
// 功能扩展：通过接口，你可以为模型定义额外的方法和属性，这在仅使用Mongoose的Schema定义时做不到的。
  
const ImageSchema = new Schema({
  title: { type: String, required: true},
  transformationType: { type: String, required: true},
  publicId: { type: String, required: true},
  securUrl: { type: URL, required: true},
  width: { type: Number},
  height: { type: Number},
  config: { type:Object},
 transformationUrl: { type:URL},
 aspectRatio:{ type: String },
 color: { type: String },
 prompt: { type: String },
 author: { type: Schema.Types.ObjectId, ref: 'User'},
 createdAt: { type: Date, default: Date.now},
 updatedAt: { type: Date, default: Date.now},

});
// 这部分定义了一个名为ImageSchema的Schema实例，它描述了图片文档的结构，包括标题、转换类型、公共ID、安全URL等字段。
// 每个字段都定义了它的类型（如String, Number, URL, Object等），是否为必填（required: true），
// 以及一些字段的默认值（如createdAt和updatedAt字段使用Date.now作为默认值）。
// author字段使用了特殊的类型Schema.Types.ObjectId，表示该字段存储的是另一个文档的ID。
// ref: 'User'表示这个ID引用的是User模型的文档。这在Mongoose中用于建立文档之间的关系，即所谓的“文档引用”。

const Image = models?.Image || model('Image', ImageSchema);

// 这行代码尝试从models对象中获取名为Image的模型。
// 如果该模型已存在（比如，在热重载环境下，防止重复编译模型），则直接使用它。
// 如果不存在，使用model('Image', ImageSchema)创建一个新的Image模型。
// Image模型之后可以用来进行创建（new Image()）、查询（Image.find()）、更新（Image.findByIdAndUpdate()）等数据库操作。

export default Image;


//补充知识点：
// 当使用Mongoose与MongoDB交互时，理解`Schema`、`model`和`models`之间的区别是非常重要的。
// 这三个概念在定义、创建、和管理数据库模型时扮演着不同的角色。让我们通过一个具体的例子来进一步探讨它们之间的区别：

// ### Schema
// `Schema`定义了MongoDB集合中文档的结构（schema），即每个文档的字段和这些字段的类型。
// 它是模型的蓝图，指明了数据的组织方式和验证逻辑。

// #### 例子
// 假设我们要创建一个用于存储用户信息的集合。用户信息包括姓名、邮箱、和注册日期。这里是一个定义这些信息的`Schema`：

// ```javascript
// import { Schema } from 'mongoose';

// const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   registeredAt: { type: Date, default: Date.now },
// });
// ```

// ### model
// `model`是一个由`Schema`编译而来的构造函数，它代表了数据库中的一个集合，
// 可以用来进行创建、查询、更新、删除等操作。
// 模型名称通常为单数形式，Mongoose会自动查找该名称的复数形式的集合。

// #### 例子
// 继续上面的例子，我们可以使用`userSchema`来创建一个`User`模型，这个模型将用来操作数据库中的`users`集合：

// ```javascript
// import { model } from 'mongoose';

// const User = model('User', userSchema);
// ```

// 现在，`User`模型可以用来创建新的用户文档、查询用户、更新用户信息等。

// ### models
// `models`是Mongoose中存储所有已经定义的模型的对象。
// 当你定义一个模型时，Mongoose会将其存储在内部的`models`对象中。这意味着你可以通过`mongoose.models`来访问任何已经定义的模型。

// #### 例子
// 如果你在应用的另一部分需要访问`User`模型，但不想再次导入它或者重新定义它，你可以使用`models`来获取：

// ```javascript
// import mongoose from 'mongoose';

// const User = mongoose.models.User;
// ```

// 这里假设`User`模型已经通过之前的`model('User', userSchema)`调用被定义过了。如果直接引用了未被定义的模型，会得到`undefined`。

// ### 总结
// 通过上述例子，我们可以看到：

// - **`Schema`** 定义了数据的结构和规则。
// - **`model`** 根据`Schema`创建了可以直接与数据库交互的对象。
// - **`models`** 存储了所有通过`model`方法创建的模型，使它们可以在应用的任何地方被重用而无需重复定义。

// 这三者共同工作，使得在Mongoose中操作MongoDB数据库变得既灵活又高效。