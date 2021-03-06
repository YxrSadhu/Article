const xhr = new XMLHttpRequest();
const url = 'https://api.github.com/users'
xhr.open('GET', url, true); // 配置 url
xhr.responseType = 'json'; // ；配置返回的数据类型
xhr.setRequestHeader('Content-Type', 'application/json'); // 设置请求头
// xhr.setRequestHeader('xxx', 'xxx') 可以这样接着配置
xhr.timeout = 5000; // 从开始算起 调用 send() 的时候开始算起，也就是触发 onloadstart 事件的时候算起， 触发 onloadend 的时候结束
xhr.ontimeout = function() {
  console.log('oops,请求超时');
}
xhr.onload = function () { // 等同于 xhr.readyState 为 4 的时候，也就是请求成功完成的时候触发
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    // 执行回调
    console.log(xhr.response);
  }
}
xhr.send(); // 发送配置好了的 ajax 请求 （POST 请求的话就在这里加 data）
