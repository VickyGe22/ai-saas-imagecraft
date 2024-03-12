# PicHandling SaaS
designed to handle different types of your pic with AI tools and transformation

# Languages & Tools
Tailwind, Shadcn.ui, Cloudinary, Clerk, Strip, Next.js, MongoDB

## Step by Step guidline
1. create your next project: npx create-next-app@latest ./
2. install shadcn.ui https://ui.shadcn.com/docs/installation/next : npx shadcn-ui@latest init
3. Setting UI: follow shadui step - layout.tsx/tailwind/globalcss/public
- install button
-install sheet
4. Router: 
- auth (layout)
- root (page): 
    - profile 
    - credit
    - transform
        - [id]
         - update
        - add
         - [type]
5. install clerk:
- .env.loc
- middleware
- add our own url
6. component:
- sidebar
- navbar
7. add constant to store the logic
8. Install MongoDB
- npm install mongodb mongoose
- create MongoDB and Mongoose connect + environ set
- 创建数据库文件：
 - lib
  - database 
    - mongoose.ts
    - models
        -image.model.ts
        - transaction.model.ts
        - user.model.ts
9. 创建actions 
- 更新utilis.ts：提前设置通用函数
- user.actions.ts
(安装：npm install qs)

**ServerActions方法概览**
- 基于用户交互更新数据库和管理状态的过程
Next.js中的Server Actions和Mutations旨在简化您直接从组件处理表单提交和数据突变的方式
从而使与服务器端逻辑的交互更容易、更有效
此功能显著简化了基于用户交互更新数据库和管理状态的过程，而无需为每个操作手动创建API路由。
**Server Actions**是在服务器上执行的异步函数，可以从服务器和客户端组件调用。
它们被标记为“use server”指令，表明该函数只能在服务器端运行。
这对于像数据库突变这样的操作特别有用，因为您希望确保敏感的逻辑和凭证不会暴露给客户端
- **简化表单提交和数据变化**:在服务器操作之前，处理表单提交通常需要设置一个API路由来处理表单数据，然后将表单数据从客户端发送到该路由。这种方法是有效的，但需要额外的样板文件，并使客户机-服务器交互更加复杂。
Server Actions通过允许您直接在组件中或在单独的文件中定义服务器端逻辑来简化这一点，从而减少了简单数据突变的单独API路由的需求
- **与Next.js功能集成**:Server Actions与其他Next.js功能无缝集成，如缓存和重新验证，允许高效的数据获取和状态管理。当Server Action改变数据时，它可以触发缓存数据的重新验证，确保用户看到最新的信息，而不需要重新加载整个页面或手动缓存管理
- **在组件中的用法**:要在客户端组件中使用服务器操作，通常需要在一个单独的文件中定义该操作，并在顶部使用“use Server”指令。这使得文件中的所有函数都是Server Actions。然后你可以在你的客户端组件中导入和使用这些操作，使服务器端逻辑可以被客户端事件触发，比如表单提交。
—**增强安全性和性能**:这些操作在服务器端运行，可以执行敏感操作，而不会向客户端暴露逻辑或凭据。这不仅提高了安全性，而且还通过减少需要在客户端下载、解析和执行的JavaScript量来优化性能。

想象一下，你在制作一个网站，其中包括一个待办事项列表。用户可以输入一个任务，点击“添加”按钮，这个任务就会保存到数据库中，并在页面上显示出来。在Next.js中使用Server Actions可以让这个过程变得简单许多。

### 传统方式

在传统的Next.js应用中，你可能需要创建一个API路由（比如`/api/addTodo`），然后在客户端编写代码，在表单提交时向这个API发送POST请求，将新的待办事项发送到服务器。服务器接收到这个请求后，将新的待办事项保存到数据库中，然后可能还需要重新获取所有待办事项，以便更新客户端显示。这个过程包括很多步骤，并且需要手动管理表单数据和服务器响应。

### 使用Server Actions

有了Server Actions，这个过程可以大大简化。你不再需要单独的API路由来处理表单提交。相反，你可以直接在组件内（或专门的Server Action文件中）定义一个异步函数来处理表单提交，这个函数会在服务器上执行。

例如，你可以有一个表单组件，当用户填写完待办事项并提交表单时，它会调用一个Server Action函数。这个函数直接在服务器上运行，可以安全地访问数据库并添加新的待办事项，然后可能还会触发页面的更新，以显示新添加的待办事项。

```jsx
// 页面组件 (客户端组件)
function TodoPage() {
  // 表单提交处理函数
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // 调用Server Action，这个函数实际上运行在服务器上
    await addTodoAction(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="todo" type="text" placeholder="添加新待办事项" />
      <button type="submit">添加</button>
    </form>
  );
}

// Server Action (可能位于单独的文件中)
async function addTodoAction(formData) {
  'use server'; // 指示这个函数运行在服务器上

  const todoItem = formData.get('todo');
  // 在这里，你可以安全地访问数据库，添加新的待办事项
  await database.insert(todoItem);
}
```

这个例子中，`'use server'`指令告诉Next.js，`addTodoAction`函数应该只在服务器上执行。这意味着你可以在这个函数中安全地处理敏感操作，比如数据库访问，而不用担心暴露敏感信息或逻辑给客户端。

### 优势总结

使用Server Actions的主要优势包括：

- **简化数据处理流程**：直接在组件内或专门的文件中处理数据提交和变更，无需单独的API路由。
- **提高安全性**：由于代码运行在服务器上，敏感逻辑和数据不会暴露给客户端。
- **提高效率**：简化开发流程，减少需要编写和维护的代码量。

总之，Server Actions使得在Next.js应用中处理表单提交和数据变更变得更加直接和高效，同时也保持了应用的安全性和可维护性。


10. Deploy first in next.js official web
WebHook功能
- 将clerk出发的event事件 - 推送至webhook(request with payload) - event processing(记录到mongoDB)
- 实现webhook的serverless function

