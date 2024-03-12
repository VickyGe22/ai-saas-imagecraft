// 在NestJS项目中，`utils.ts`文件通常用于存放那些可以在应用程序的多个地方使用的通用功能或者帮助函数。
// 这样做的目的是为了提高代码的复用性，避免在不同的地方重复编写相同的代码逻辑。
// 简单来说，就是把那些你经常需要用到的功能集中存放，需要时直接调用，既方便又有效率。

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "qs";

import { aspectRatioOptions } from "@/app/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
}

//Placeholder loader - while image in transforming
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;
// 这段代码主要用于生成一个占位符加载动画，通常在图片转换或加载时显示。
// 首先，shimmer函数接收宽度和高度参数，返回一个SVG图像的字符串。
// 这个SVG包含一个线性渐变的效果，通过animate标签使得渐变动画在水平方向上循环移动，产生一种闪光或发光的视觉效果。
// toBase64函数则将SVG字符串转换为Base64编码，以便可以将其嵌入到网页中。
// 最后，dataUrl常量包含了转换后的Base64编码的SVG图像，可以直接作为图片源使用。
// 这种方法在实际加载图片前提供了一种视觉上吸引人的加载占位符，改善了用户体验

// FORM URL QUERY
export const formUrlQuery = ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};
// 这个函数formUrlQuery的作用是构造一个包含特定查询参数的URL。
// 它接收一个包含searchParams（当前URL的查询参数）、key（要添加或更新的查询参数键）、和value（对应键的值）的对象。
// 函数首先使用qs.parse解析现有的查询参数到一个对象，然后添加或更新键值对，
// 最后使用qs.stringify将更新后的对象转换回查询字符串，同时去除任何空值。
// 结果是一个新的URL，包含了更新或添加的查询参数，可用于导航或链接。

// 这个函数formUrlQuery主要用于在用户交云Web应用时动态地更改或添加URL中的查询参数。
// 例如，当用户在一个表单中选择不同的选项或在搜索框中输入关键词时，
// 你可以使用这个函数来更新页面URL，而不重新加载页面。
// 这样做可以增强用户体验，使得用户的选择或搜索状态能够在URL中反映出来，便于分享和书签。
// 此外，它也有助于实现基于URL的状态管理，例如在单页应用（SPA）中。
// 像是给网址加邮票：
// 假如你在网上逛街，看到喜欢的东西想记下来，或者告诉朋友这个地方。
// 这个函数就帮你在现有的网址上加上一些小标记（比如价格、颜色等），然后生成一个新的网址。
// 这样，你就可以把这个有标记的网址保存下来，或者发给朋友，他们点开就能看到你看到的东西，而不用重新找一遍。

// REMOVE KEY FROM QUERY
export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(searchParams);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// DEBOUNCE
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
// 这个`debounce`函数的作用是防止一个函数被频繁调用。
// 比如你在搜索框打字，每打一个字就搜索一次，这样服务器压力太大。
// 用了`debounce`后，它会等你打完字几秒后，再去搜索一次，减少不必要的调用，提高效率。

// GE IMAGE SIZE
export type AspectRatioKey = keyof typeof aspectRatioOptions;
export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] || 1000;
};
// 这个`getImageSize`函数的目的是根据给定的类型、图片对象和尺寸（宽度或高度）来获取图片的尺寸值。
// 如果类型是"fill"，它会查找一个名为`aspectRatioOptions`的对象，使用图片的宽高比（`aspectRatio`）作为键来获取相应的尺寸。
// 如果没有找到对应的值，或者类型不是"fill"，它会直接从图片对象中获取尺寸信息
// 如果这些信息也不存在，就默认返回`1000`。这样的设计可以灵活适应不同的图片处理需求。

// DOWNLOAD IMAGE
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};
// 这个`download`函数用于从给定的URL下载文件，并为其指定一个文件名。
// 首先，它会检查是否提供了URL，如果没有，就抛出一个错误。
// 然后，它使用`fetch`来请求这个URL，获取到响应后转换为`blob`对象。
// 接着，创建一个临时的`blob` URL和一个`<a>`元素，将`<a>`元素的`href`属性设置为这个临时URL，并设置下载的文件名。
// 最后，通过模拟点击这个`<a>`元素来触发下载。如果过程中有错误，会在控制台打印错误信息。


// DEEP MERGE OBJECTS
export const deepMergeObjects = (obj1: any, obj2: any) => {
  if(obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};
// 这个`deepMergeObjects`函数用于深度合并两个对象。
// 它检查第二个对象是否为`null`或`undefined`，如果是，则直接返回第一个对象。
// 否则，它会遍历第一个对象的所有属性，如果两个对象中对应的属性都是对象，则递归地进行深度合并；
// 如果不是，就直接使用第一个对象的属性值。这样，你可以合并嵌套的对象，确保深层属性也被正确合并。