# flexAnimation

这个是用纯JS编写的轻量级生成动画的库，而且它能够兼容目前的主流游览器甚至到较老版本的IE6。

当前版本0.5.1。

## 快速开始

### 创建Animate对象的实例

``` js

	var myAnimation=flexibleAnimation.create(document.getElementById('test'));

```

flexibleAnimation.create()会返回一个Animatie对象的示例。

### 为这个实例配置动画信息



``` js

	var myAnimation=flexibleAnimation.create(document.getElementById('test'));
	myAnimation.set({
            rules:[
                'opacity:1',
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:400px',
                'top:500px'
            ],
            duration:1000,
            easing:'ease'
     });

```

### 开始动画



``` js

	var myAnimation=flexibleAnimation.create(document.getElementById('test'));
	myAnimation.set({
            rules:[
                'opacity:1',
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:400px',
                'top:500px'
            ],
            duration:1000,
            easing:'ease'
     });
     myAnimation.start();

```

### 同一段时间进行多个动画

在同一个时间段内，你可以创建多个Animate实例，并分别执行动画。但是为了提升动画的性能，我并不推荐使用这种方式。你应该将这些Animate实例放入动画队列中去执行。目前这个动画队列是同步的，这就意味着放入队列中的动画实例可能都会在同一时间内执行。


``` js

var myAnimation=flexibleAnimation.create(document.getElementById('test'));
	myAnimation.set({
            rules:[
                'opacity:1',
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:400px',
                'top:500px'
            ],
            duration:1000,
            easing:'ease'
     });
var myAnimation1=flexibleAnimation.create(document.getElementById('test1'));
	myAnimation.set({
            rules:[
                'opacity:1',
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:400px',
                'top:500px'
            ],
            duration:1500,
            easing:'ease'
     });     

var myAnimationList = flexibleAniamtion.createAnimationList(myAnimation,myAnimation1);

myAnimationList.start();

```

### 周期性生产规律性动画

我们可以使页面上的某个元素连续多次或者一直做着规律性动画。下面举一些简单的栗子:


连续执行3次动画,每一次动画,id为test元素向左移动100px,向下移动200px,背景色从默认颜色变化绿色。

``` js

	var myAnimation=flexibleAnimation.create(document.getElementById('test'));
	myAnimation.set({
            rules:[
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:+100px',
                'top:+200px'
            ],
            times:3,// 执行3次动画
            duration:1000,
            easing:'ease'
     });
     myAnimation.start();


```

动画永不停止,每一次动画,id为test元素向左移动100px,向下移动200px,背景色从默认颜色变化绿色。

``` js


	var myAnimation=flexibleAnimation.create(document.getElementById('test'));
	myAnimation.set({
            rules:[
                'backgroundColor:#00FF00',
                'transform:rotate(90deg)',
                'left:+100px',
                'top:+200px'
            ],
            forever:true,
            duration:1000,
            easing:'ease'
     });
     myAnimation.start();



```

注意：与颜色相关的属性、transform属性暂不支持用+或者-符号表示递增或者递减

## flexibleAniamtion



### createAnimation(dom,config)

创建并返回一个Animate对象实例

- dom	可选,这个Animate对象绑定的DOM元素

- config 可选,动画效果的配置信息
  - rules 数组,描述动画最终的目标信息
  - easing 字符串,可选 设定动画的速度曲线(可选:'linear'、'ease'(默认)、'easeIn'、'easeOut'、'easeInOut') 
		   数组-必须为4个数字,前两个数字代表贝塞尔曲线的P1点，后两个数字代表P2点。例如:0.42,0.12,0.23,0.18
  - duration 数字,动画持续时间,可选,单位为ms	
  - delay 数字,动画的延迟时间,可选,单位为ms
  - times 数字,动画执行的次数,可选,默认为1
  - forever 布尔值,表示动画是否一直执行
  - callback 函数,可选，动画执行完毕后的回调函数(forever动画不会被调用!)

### createAnimationList(Animate,Animate1,Animate2...)

创建并返回一个动画队列

``` js
var myAnimationList = flexibleAniamtion.createAnimationList(myAnimation,myAnimation1);

```



## Animate对象的方法

### init(domElement)

初始化需要产生动画的DOM元素

- element 必选,dom元素对象

举个栗子：

``` js

	var div=flexibleAnimation.create();
	var test=document.getElementBy('test');
	div.init(test);

```




### set(config)

- config 对象,配置动画的信息
  - rules 数组,描述动画最终的目标信息
  - easing 字符串,可选 设定动画的速度曲线(可选:'linear'、'ease'(默认)、'easeIn'、'easeOut'、'easeInOut') 
		   数组-必须为4个数字,前两个数字代表贝塞尔曲线的P1点，后两个数字代表P2点。例如:0.42,0.12,0.23,0.18
  - duration 数字,动画持续时间,可选,单位为ms	
  - delay 数字,动画的延迟时间,可选,单位为ms
  - times 数字,动画执行的次数,可选,默认为1
  - forever 布尔值,表示动画是否一直执行
  - callback 函数,可选，动画执行完毕后的回调函数(forever动画不会被调用!)

举个例子:

``` js
var div=flexibleAniamtion.createAnimation(document.getElementById('test'),{
            rules:[
                'opacity:1',
                'backgroundColor:#FF0000',
                'transform:rotate(90deg)',
                'left:400px',
                'top:500px'
            ],
            duration:800,
            easing:'ease'
        });

```

### start()

开启动画



## AnimateList对象的方法

### add(Animate,Animate1,Animate2...)

将一个或者多个Animate的实例放入动画队列当中。

``` js
var myAnimationList = flexibleAniamtion.createAnimationList();
myAnimationList.add(myAnimation,myAnimation1);

```

### delete(Animate)

删除指定的该动画队列中指定的Animate实例。

``` js
var myAnimationList = flexibleAniamtion.createAnimationList();
myAnimationList.add(myAnimation,myAnimation1);
myAnimationList.delete(myAnimation1);

```

### start()

执行此动画队列的所有动画


## rules支持


- 表示递增或者递减地改变属性值，可用+、-,例如:left:-200px(每一次动画left逐渐减少200px)。与颜色相关的属性以及transform属性暂时不支持此特性。
- 不支持所有简写的属性(勿用),例如:font,background,border
- 不完全支持transform:rotate(xdeg)，不过也能产生效果
- 如果存在两个同样的属性，只对第一个起作用
- IE8以下以及个别游览器颜色变化效果仅支持rgb格式
- 如果想要使rgba产生动画效果，该DOM元素本身的颜色值必须为rgba格式，否则无效！

