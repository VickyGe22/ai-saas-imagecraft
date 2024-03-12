import mongoose, {Mongoose} from 'mongoose';
// mongoose是一个MongoDB对象建模工具，设计用于在异步环境中工作，提供了一种直接映射到MongoDB文档的方式，并且其API提供了方便的方法来操作MongoDB数据库。Mongoose类型代表了mongoose模块的实例类型

const MONGODB_URL = process.env.MONGODB_URL;
// 其值从环境变量MONGODB_URL中获取。环境变量是从系统外部传递给应用程序的动态配置信息。在这种情况下，MONGODB_URL应该包含了用于连接到MongoDB数据库的完整URL，通常包括用户名、密码、数据库地址和数据库名。

interface MongooseConnection {
    conn: Mongoose | null;
    connect: () => Promise<Mongoose> | null; 
}
// Promise<Mongoose>代表一个异步操作，这个操作最终会解析为一个Mongoose实例。
// 这个方法用于建立到MongoDB的连接，并且一旦连接成功，就会返回一个mongoose实例。
// 如果在某些情况下不可能建立连接（比如，没有提供数据库URL），这个方法可能会返回null。


let cached: MongooseConnection = (global as any).mongoose
// 这行代码尝试从全局对象global中获取一个名为mongoose的属性，该属性被假定为MongooseConnection类型，
// 并将其赋值给局部变量cached。TypeScript中，(global as any)的语法是将global对象的类型断言为any，
// 这样可以访问任何属性而不会遇到类型检查的错误。


if(!cached){
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}
// 如果cached是未定义或者null，这段代码会初始化一个新的对象，该对象具有conn和promise两个属性，
// 初始值都设为null，并将这个对象既赋值给变量cached，也保存到global.mongoose中。
// 这样做的目的是确保整个Node.js应用中，无论这段代码被执行多少次，数据库连接的逻辑只初始化一次。

export const connectToDatabase = async() => {
    if(cached.conn) return cached.conn;
    // 如果cached.conn已经存在，意味着数据库连接已经建立，直接返回这个连接，避免重复连接数据库

    if(!MONGODB_URL) throw new Error('MONGODB_URL is not defined');
    
   cached.promise = 
    cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'ImageCraft', bufferCommands:false})
    // 如果cached.promise是null，使用mongoose.connect方法尝试建立数据库连接，
    // 并将返回的Promise对象赋值给cached.promise
    // mongoose.connect接受两个参数：数据库URL和一个选项对象，其中dbName指定了要连接的数据库名，bufferCommands: false禁用了mongoose的命令缓冲，要求命令只能在数据库连接建立之后执行。

    cached.conn = await cached.promise;
    // 使用await关键字等待cached.promise解析，这会暂停函数的执行，直到Promise解析完成。解析成功后，将返回值（一个mongoose连接实例）赋值给cached.conn。
    
    return cached.conn;  //返回一个mongoose实例，这个实例可以用来操作数据库。

}


// 连接函数 connectToDatabase
// 这个函数是异步的
// 这段代码通过检查全局变量和使用Promise来确保在应用程序的生命周期内只尝试建立一次到MongoDB的连接，
// 并且在之后的请求中重用这个连接。这种模式有助于避免数据库连接过多，同时减少每次请求所需的时间，因为不需要重新建立数据库连接。