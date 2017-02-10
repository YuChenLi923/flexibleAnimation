# flexibleAnimation
这个是用纯JS编写的创建动画的小demo,您不用使用jQ这些库，而且它能够兼容目前的主流游览器甚至到较老版本的IE6,你能轻松地添加动画，当前版本0.5。

## 使用方法
引入flexibleAnimation.min.js或者flexibleAnimation.js文件，接着只需要下面这几步就能够创建出动画效果了

### 创建animate对象的实例

``` js

	var div=new animate();

```


### animate对象的方法

#### init(element)

初始化需要产生动画的元素,只需要传入元素对象即可，参数:对象
``` js

	var div=flexibleAniamtion();
	var test=document.getElementBy('test');
	div.init(test);

```

#### callback(func)

创建动画执行完毕后的回调函数,参数:函数

#### start([key:value,key1:value1],easing,duration)

开启动画

- [key:value,key1:value1] 
字符串数组，用于设定动画最终完成的时候元素的属性值。例如:

``` js

	[
		"color:#161616",
		"backgroundColor:#ffffff",
		"left:100px"
	]


```

- easing

设定动画的速度曲线 

字符串-'linear'、'ease'、'easeIn'、'easeOut'、'easeInOut'

数组-必须为4个数字,前两个数字代表贝塞尔曲线的P1点，后两个数字代表P2点。例如:0.42,0.12,0.23,0.18

- duration

动画持续时间，单位为ms

#### 示例代码

``` html

<div class='test' id='test' style='left:100px;margin-left:100px;opacity:0;background-color:#333333'></div>

```
or css

``` css
.test{
 left:100px;
 margin-left:100px;
 opacity:0;
 background-color:#333333';
}

```

``` js

	var div=new animate();
	div.init(document.getElementById('test'))
	div.start([
		'opacity:1',
		'left:500px',
		'top:200px',
		'backgroundColor:#124565'
		]
	,600,'linear');

```

## 属性支持

- 不支持所有简写的属性(勿用),例如:font,background,border
- 不完全支持transform:rotate(xdeg)，不过也能产生效果
- 如果存在两个同样的属性，只对第一个起作用

