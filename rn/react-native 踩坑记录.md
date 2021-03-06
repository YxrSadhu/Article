## 配置环境记录
跟着官网讲得走，不容易踩坑。

注意点：
1. 就是配置环境变量时，我用的终端是 zsh 不是 bash，用的哪个得分别在 ~/.zshrc 和 ~/.bash_profile 中配置，我是一起配了。
2. 手动下载不同版本 xcode :[传送门](https://developer.apple.com/download/more/)

## 调试
#### React Native Debugger 官方工具
如果根据文档 指令 下载不了的话，去 github release [下载](https://github.com/jhen0409/react-native-debugger/releases)
下载时根据 RN 版本下载对应版本的 RN Debugger，一般来说如果 RN 是最新版的，那么 RN Debugger 也下最新版的。
#### 下载 React-devtools
当使用 `sudo npm install -g react-devtools` 时无法成功，报个 permission denied 的错。

这个问题可以见 facebook react-devtools [issues](https://github.com/facebook/react-devtools/issues/741)讨论

因为 npm 处于安全考虑不支持以 root 用户运行，即使用 root 身份运行了， npm 会自动转成一个叫 nobody 的用户来运行，这个用户几乎没有权限，假如遇到一些 npm install 时需要权限操作，就会报错，就算你用 sudo 也只是对 nobody 这个用户作用。

所以解决方法就是：加个 `--unsafe-perm` 参数，让 npm 运行时不切换为 nobody 用户上，即使是 root。

`sudo npm install -g react-devtools --unsafe-perm` 

#### V2RayX 终端设置代理
任何代理工具默认只代理 HTTP,不代理终端。若想代理终端，在 V2RayX 设置中点击 `Copy Http Proxy Shell export line`，赋值的内容就是 `export http_proxy="http://127.0.0.1:8001"; export HTTP_PROXY="http://127.0.0.1:8001"; export https_proxy="http://127.0.0.1:8001"; export HTTPS_PROXY="http://127.0.0.1:8001"`。
然后配置终端的环境变量， `iTerm` -> `~/.zshrc`,  `bash` -> `~/.bash_profile`
可以用 `curl www.google.com` 验证。

#### 查看端口占用情况
MacOs: `lsof` 列举所有端口占用列表, `lsof | less` 分页展示， `lsof -i :8081` 查看 8081 端口有没有被占用，`kill -9 进程ID(PID)` 则是杀掉该 pid 进程。

#### packager server
问题日志： `No bundle URL present.Make sure you're running a packager server or have included a .jsbundle`

是由于 VPN 代理工具是全局模式，导致了之前可以正常连接到本地的packager的server，由于全局网络代理，从而需要绕道国外服务器，再去连接本地，所以无法正常访问了。

解决方法就是把全局模式改为自动模式就好，或者关了。

#### 这咋描述
1.
> /Users/sadhu/Desktop/momoko/ios/momoko.xcodeproj Building for iOS Simulator, but the linked and embedded framework 'icare_obj.framework' was built for iOS.
和
2. 
> /Users/sadhu/Desktop/momoko/ios/momoko.xcodeproj Building for iOS Simulator, but the linked library 'libwifi_voice.a' was built for iOS.

解决办法：在 Xcode 中点击 project 名字 -> `build settings` -> 搜索 `validate` 把 `Validate Workspace` 设为 `Yes`。

3. 
> momoko/ios/Pods/Target Support Files/Pods-momoko/Pods-momoko.debug.xcconfig: unable to open file (in target "momoko" in project "momoko")

解决办法：一般这种情况是下载别人的 RN 应用，重新 `pod install` 下安装好依赖

#### Mac 网络监视器
假如终端在下载 github 的东西，下载时间比较长，可以在 Mac 活动监视器的网络监视器中搜索 `git` 查看 `git-remote-https` 的下载速度，也可以在 `https://api.github.com/repos/项目名/包名`，搜索 `Size` 字段查看包大小。

当然，网络监视器监视所有本地的网络交互，也可以查看其它，比如梯子。

#### npm install 和 yarn install
这两个的区别

#### react navigation 4.x 
##### 生命周期事件
就 4 个顾名思义的事件： willFocus、didFocus、willBlur、didBlur
注意点：
页面入栈：被覆盖页面触发 willBlur 和 didBlur 事件
页面出栈：出栈页面的 componentWillUnmount 触发，willBlur 不会触发。

页面生命周期与 react navigation 生命周期事件的关系：
1. 按顺序读：
一个包含 页面 A 和 B 的 StackNavigator ，当跳转到 A 时，componentDidMount 方法会被调用； 当跳转到 B 时，componentDidMount 方法也会被调用，但是 A 依然在堆栈中保持 被加载状态，他的 componentWillUnMount 也不会被调用。
当从 B 跳转到 A，B的 componentWillUnmount 方法会被调用，但是 A 的 componentDidMount方法不会被调用，应为此时 A 依然是被加载状态。

2. componentDidMount 的触发时机比 willFocus 快。

##### withNavigation 高阶组件：

当一个组件 A 想要访问到使用它那个组件 B 的 navigator 对象，并且这个组件未在路由初始化时注册，那么在 export 出这个组件的时候可以导出 `withNavigation(组件A)` 包裹组件，`withNavigation()` 方法的结果就是一个组件(wrapper 组件)，在组件 B 中使用的实际上是这个包裹组件。

此时在组件 A 中就可以通过 props 访问到组件 B 的 navigator 对象了 （this.props.navigation.xxx）

## yarn 有时候装的依赖太大
 yarn 一段时间内没装好这个包的话，会直接报网络问题请 retry 的错。可以加个 yarn add xxx --network-timeout 100000。

## 构建工具的缓存
当引入一个依赖库，但是构建工具还是对某些 package 使用了缓存去构建的话，会导致引入的包无效。可以在重新构建项目时清除缓存，如 RN 里 `npm start -- --reset-cache`。

## yarn 配置私服
如果一直 yarn 失败，看看自己的终端 (bash、zsh 等是否配置了代理)

## FlatList
FlatList 的数据源，只有在每次引用被改变时，才能更新视图。

也就是说，假如数据源是同一个引用 `obj = [a, b, c]`，当 `obj.push(xxx)` 时，重新渲染视图(setState 或 mobx 等)时，不会更新视图。 所以使用 FlatList 时，要养成需要 rerender 视图时，改变数据源引用(赋给另一个变量或深拷贝一份)的习惯。

## React Navigation
传参时，如果传的是引用类型值，在页面接收到参数时，外层参数改变了引用内部的值，在该页面会感知到改变。也就是也是按引用传递的，所以 mobx `observerble` 在外层观察过的话，在该页面也保持观察着的特性。

## HSV 模型
H -->  色调， S -->  饱和度， V --> 明度

H 控制360度的角度、S 控制边缘距离圆心（半径）的距离、V 控制明亮程度。