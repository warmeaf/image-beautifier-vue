# image-beautifier-vue

预览地址: https://warmeaf.github.io/image-beautifier-vue/

## 一、说明

image-beautifier 是一款开源的截图美化工具，地址：[https://github.com/CH563/image-beautifier](https://github.com/CH563/image-beautifier)。基于`react`和`mobx`构建，这是基于`vue3`和`pinia`的版本

![](https://cdn.nlark.com/yuque/0/2025/png/2894784/1745507395280-b0a35166-74ac-4f7d-98c9-da15805506c8.png)

## 二、架构

该项目采用基于组件化的架构，并结合 Pinia 进行状态管理，实现了功能模块的高度解耦和可维护性。其核心设计思想是将影响最终输出图片外观的**外部配置项**与编辑器内部的**交互状态**进行分离管理，这种分离使得状态管理更加清晰，逻辑更加明确

### 核心架构分析

1. **组件化架构**项目将 UI 划分为多个独立的、可复用的组件，存放在 `src/components` 目录下。主要可以分为以下几类：
   - **核心编辑区组件**：位于 `src/components/editor`，包括 `Editor.vue`、`View.vue` 和 `Zoom.vue`。其中 `View.vue` 是最核心的组件，它基于 `leafer-ui` 库实现了画布的渲染、图形的绘制以及所有与用户在画布上的交互逻辑。
   - **侧边栏配置组件**：位于 `src/components/sideBar`，包含了所有用于调整图片和框架样式的 UI 控件，例如 `SizeBar.vue`、`ColorPicker.vue` 等。这些组件负责响应用户的操作，并更新 Pinia 中的状态。
   - **头部工具栏组件**：位于 `src/components/header`，提供了选择绘图工具、颜色、画笔宽度等功能。
   - **初始化页面组件**：位于 `src/components/init`，负责处理用户上传或粘贴图片的初始界面。
2. **状态管理 (Pinia)**项目通过 Pinia 来管理全局状态，并将其划分为两个独立的模块（store）：`editorStore` 和 `optionStore`，分别对应不同的职责范围。
   - `optionStore`** (**`src/stores/option.js`**)：管理外部配置项**这个模块负责管理所有会影响最终生成图片外观的配置项。这些配置项通常由侧边栏的 UI 组件进行修改。主要包括：
     - 图片本身属性：`img` (图片源)、`scale` (缩放)、`align` (对齐方式)。
     - 框架样式：`padding` (内边距)、`round` (圆角)、`shadow` (阴影)、`background` (背景)。
     - 水印：`waterImg` (水印图片)、`waterIndex` (水印层级)。
   - `editorStore`** (**`src/stores/editor.js`**)：管理编辑器内部状态**这个模块负责管理编辑器自身运行时的状态，这些状态通常由用户在画布上的直接交互触发。主要包括：
     - 画布实例：`app` (`leafer-ui` 的 App 实例)。
     - 当前工具：`useTool` (用户当前选择的工具，如 'Pencil', 'Square' 等)。
     - 绘图属性：`annotateColor` (标注颜色)、`strokeWidth` (画笔宽度)。
     - 图形元素：`shapes` (一个 Map，存储了所有绘制在画布上的图形对象)。
     - 编辑器状态：`scale` (画布的缩放比例)、`cursor` (鼠标指针样式)。
   - leafer-in/editor：**管理自身可编辑**`**shape**`**的状态**，用户绘制完图形元素后，更改图形元素的尺寸、位置等时自动管理

### 数据流向与交互

项目的核心数据流可以概括如下：

1. **配置项变更 -> 画布更新**：
   - 用户在 `SideBar` 组件中操作 UI 控件（例如拖动滑块调整 `padding`）。
   - `SideBar` 中的组件调用 `optionStore` 的 `actions` (例如 `setPadding`) 来更新状态。
   - `View.vue` 组件通过 `v-bind` 或 `watch` 监听 `optionStore` 中状态的变化。
   - 当状态变化时，`View.vue` 会重新渲染或调用 `leafer-ui` 的 API 来更新画布上元素的样式（例如通过 `FrameBox` 组件更新框架的样式）。
2. **编辑器交互 -> 状态更新 -> 画布更新**：
   - 用户在 `Header` 组件中选择一个绘图工具（例如点击“矩形”按钮）。
   - `Header` 组件调用 `editorStore.setUseTool('Square')` 来设置当前工具。
   - 用户在 `View.vue` 的画布上拖动鼠标进行绘制。
   - `View.vue` 中为 `leafer-ui` 的 `app` 实例绑定的事件监听器（如 `DragEvent.START`, `DragEvent.DRAG`）被触发。
   - 事件监听器的回调函数会创建一个新的图形对象，并调用 `editorStore.addShape()` 将其添加到 `shapes` 中。
   - `View.vue` 的模板通过 `v-for` 遍历 `editorStore.shapesList`，将 `ShapeLine` 组件渲染到画布上，从而显示出用户绘制的图形。
3. **直接操作画布图形元素**
   - 用户绘制完图形元素比如填充矩形后，选中并手动调整位置、尺寸、旋转角度等时，状态由`leafer-in/editor`自己管理

## 三、数据结构

### 1. 配置模块 (`stores/option.js`)

该模块主要负责存储和管理用户对图片进行美化的所有可配置选项。这些选项直接影响最终生成图片的外观。

**负责功能：**

- **图片信息 (**`img`**)**: 存储当前正在编辑的图片的基本信息，包括 `src`, `width`, `height`, `type`, `name`。
- **变换 (**`scale`**, **`scaleX`**, **`scaleY`**)**: 控制图片的缩放和翻转状态。
- **内边距 (**`padding`**, **`paddingBg`**)**: 设置图片内容与边框之间的距离和背景颜色。
- **样式 (**`round`**, **`shadow`**)**: 定义图片的圆角和阴影效果。
- **画框 (**`frame`**, **`frameMode`**)**: 管理图片外部的设备或装饰性边框类型及其模式（如 `cover`）。
- **背景 (**`background`**)**: 控制整个画布的背景，可以是纯色、渐变或预设图片。
- **对齐 (**`align`**)**: 决定图片在画布中的对齐方式（如居中、左对齐等）。
- **水印 (**`waterImg`**, **`waterIndex`**)**: 管理应用在图片上的水印图像及其层级。
- **尺寸 (**`size`**, **`frameConf`**)**: 控制画布的尺寸，支持自动或自定义尺寸，并存储具体的宽高和背景配置。

**数据结构示例：**

```javascript
{
  img: { src: '...', width: 800, height: 600, ... },
  scale: 1,
  padding: 20,
  round: 10,
  shadow: 3,
  frame: 'macbookpro16',
  background: 'default_1',
  align: 'center',
  // ...
}
```

### 2. 编辑器模块 (`stores/editor.js`)

该模块负责管理编辑器本身的状态和交互逻辑，包括绘图实例、工具状态、画布上的各种元素等。

**负责功能：**

- **应用实例 (**`app`**)**: 持有核心的 Leafer UI 应用实例，是进行所有画布操作的入口。
- **视图控制 (**`scale`**)**: 存储当前画布的缩放比例。
- **工具状态 (**`useTool`**, **`annotateColor`**, **`strokeWidth`**)**: 管理当前激活的编辑工具（如铅笔、形状工具）以及相关配置（颜色、线条宽度）。
- **形状管理 (**`shapes`**)**: 使用 `Map` 结构存储和管理所有添加到画布上的形状（如箭头、矩形、文本等），方便快速增删查改。
- **UI 状态 (**`message`**, **`theme`**)**: 控制应用内的消息提示和主题（亮色/暗色）。
- **快照 (**`snap`**)**: 存储画布的快照，用于特定功能（如放大镜）。
- **撤销/重做 (**`clearFun`**, **`destroy`**)**: 管理画布清理和销毁的逻辑。

**数据结构示例：**

```javascript
{
  app: LeaferAppInstance,
  scale: 100,
  useTool: 'Pencil',
  annotateColor: '#ff0000',
  shapes: Map<shapeId, shapeObject>,
  theme: 'light',
  // ...
}
```

### 3. 总结

项目的状态管理设计是清晰且模块化的：

- `option.js` 关注“什么”，即图像的最终视觉表现和配置。
- `editor.js` 关注“如何”，即实现这些视觉表现所需要的编辑器状态和工具。

## 四、经验

- [Canvas 引擎 leafer 的使用](https://www.yuque.com/nextc/wzsg4i/fv58779o2scgxxtg)
- [TailWind CSS 的使用](https://www.yuque.com/nextc/wzsg4i/apm6er0svh0nffug)
- [界面美化经验](https://www.yuque.com/nextc/wzsg4i/tbgdc3omg4gdaauz)
- [CSS @layer 的使用](https://www.yuque.com/nextc/wzsg4i/yxrkrg55sygf4l93)
- [颜色选择器组件及 TinyColor 使用](https://www.yuque.com/nextc/wzsg4i/vmn4tx99429mocz3)
- [Emoji 表情库：emoji-mart](https://www.yuque.com/nextc/wzsg4i/sgl9v2hpgrso9h0i)
- [图片裁剪：vue-cropper](https://www.yuque.com/nextc/wzsg4i/rllpdvtn9he5ag5q)
- [图标库：lucide](https://www.yuque.com/nextc/wzsg4i/rrbfd9uwfogv6i2v)
- [唯一 id 生成：nanoid](https://www.yuque.com/nextc/wzsg4i/slkq0o34nxwoterg)
- [尺寸监控：resize-detector](https://www.yuque.com/nextc/wzsg4i/ixnp7w5urhutepkh)
- [键盘快捷键：tinykeys](https://www.yuque.com/nextc/wzsg4i/uqz6xtydacinbgd1)
- [截图功能实现](https://www.yuque.com/nextc/wzsg4i/kltxitg5vgupg3eu)
