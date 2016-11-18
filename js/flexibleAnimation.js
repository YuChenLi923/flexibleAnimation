//动画函数 0.4 by chen
//date:2016/11/18 21:37 
var flexibleAniamtion=(function(){
	//获取颜色的16位进制的字符串
	function getColorValue(color){
	var colorObj={
		r:0,
		g:0,
		b:0
	}
	if(color.indexOf('gb')==0||color.indexOf('GB')===0){
		var colorValue=color.match(/[0-9]{1,}/g);
		if(colorValue){
			colorObj.r=parseInt(colorValue[0]);
			colorObj.g=parseInt(colorValue[1]);
			colorObj.b=parseInt(colorValue[2]);
		}
	}
	else{
		var colorValue=color.match(/[0-F]{2}/g);
		colorObj.r=parseInt(colorValue[0],16);
		colorObj.g=parseInt(colorValue[1],16);
		colorObj.b=parseInt(colorValue[2],16);
	}	
		return colorObj;
	}
	//处理颜色单位
	function colorHandler(self,startValue,endValue,curTime,duration){
		var curR=Math.floor(self.easing(curTime,startValue.r,endValue.r,duration)),
			curG=Math.floor(self.easing(curTime,startValue.g,endValue.g,duration)),
			curB=Math.floor(self.easing(curTime,startValue.b,endValue.b,duration)),
			R,G,B;
			R=curR<=15?'0'+curR.toString(16):curR.toString(16);
			G=curG<=15?'0'+curG.toString(16):curG.toString(16);
			B=curB<=15?'0'+curB.toString(16):curB.toString(16);
			cur=R+G+B;
		return cur;
	}
	//获取当前时刻martix的值
	function getMatrix(self,startValue,endValue,curTime,duration){
		var len=startValue.length,
			value=[];
		for(var i=0;i<len;i++){
				value[i]=self.easing(curTime,Number(startValue[i]),Number(endValue[i]),duration);
		}
		return value.join();
	}
	//处理变化矩阵matrix
	function matrixHandler(transform){
		var pattern=/[-]{0,}[0-9]{1,}[\.]{0,}[0-9]{0,}([e-][0-9]{0,}){0,}/g,
			value=transform.match(pattern);
		return value;
	}
	//转换为变形矩阵matrix
	function toMatrix(transformValue){
		var doc=document,
			testDiv=doc.createElement('div'),
			value;
		testDiv.style.cssText='height:0px;width:0px;opacity:0';
		doc.body.appendChild(testDiv);
		testDiv.style.transform=transformValue;
		value=doc.defaultView.getComputedStyle(testDiv,null).transform;
		doc.body.removeChild(testDiv);
		return value;
	}
	//获取动画执行的当前阶段的对应的属性值
	function curHandler(propertyName,self,prefix,curTime,startValue,endValue,duration){
		if(propertyName=='transform'){
			return  getMatrix(self,matrixHandler(startValue),matrixHandler(endValue),curTime,duration);
		}
		if(prefix==='#'){
			return colorHandler(self,getColorValue(startValue),getColorValue(endValue),curTime,duration);
		}
		else{
			return self.easing(curTime,startValue,endValue,duration);
		}
	}
	//处理样式规则
	function ruleHandler(obj,rule){
		var ruleObj=new Object(),
			rules=rule.split(':'),
			suffix,
			computedtyle=document.defaultView.getComputedStyle(obj,null),
			result;
		if(rules[0]=='transform'){
			ruleObj.prefix='matrix('
			ruleObj.suffix=')';
			ruleObj.endValue=toMatrix(rules[1]);
			ruleObj.startValue=computedtyle[rules[0]];
		}
		else if(rules[0]=='color'||rules[0]=='backgroundColor'){
				ruleObj.prefix='#';
				ruleObj.suffix='';
				ruleObj.endValue=rules[1].slice(1);
				ruleObj.startValue=computedtyle[rules[0]].slice(1)||'000000';
		}
		else{
			if(suffix=rules[1].match(/[a-zA-Z%]{1,}/)){
				suffix=rules[1].match(/[a-zA-Z%]{1,}/)[0];
			}
			else{
				suffix='';
			}
			ruleObj.prefix='';
			ruleObj.startValue=parseInt(computedtyle[rules[0]]);
			ruleObj.endValue=parseInt(rules[1]);
			ruleObj.suffix=suffix;
		}
		ruleObj.name=rules[0];
		return ruleObj;
	}
	//贝塞尔动画时间曲线函数，使用的时候调用其中的solve(x,epsilon)方法，参数x为当前动画执行的时间,参数eplsilon为精确度
	function UnitBezier(p1x, p1y, p2x, p2y) {
			this.cx=3.0*p1x;
			this.bx=3.0*(p2x-p1x)-this.cx;
			this.ax=1.0-this.cx-this.bx;
			this.cy=3.0*p1y;
			this.by=3.0*(p2y-p1y)-this.cy;
			this.ay=1.0-this.cy-this.by;
	}
	UnitBezier.prototype = {
		constructor:UnitBezier,
		epsilon : 1e-2,  // 默认精度
		sampleCurveX:function(t) {//贝赛尔曲线t时刻的坐标点的X坐标
		   	return ((this.ax*t+this.bx)*t+this.cx)*t;
		},
		sampleCurveY : function(t) {
		   	return ((this.ay * t + this.by) * t + this.cy) * t;
		},
		sampleCurveDerivativeX : function(t) {//贝赛尔曲线t时刻的坐标点的Y坐标
		    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
		},
		solveCurveX : function(x, epsilon) {
				var t0,
					t1,
					t2,
					x2,
					d2,
					i;
				for (t2 = x, i = 0; i < 8; i++) {
				    x2 = this.sampleCurveX(t2) - x;
				    if (Math.abs (x2) < epsilon)
				        return t2;
				    d2 = this.sampleCurveDerivativeX(t2);
				    if (Math.abs(d2) < epsilon)
				        break;
				    t2 = t2 - x2 / d2;
				}
				t0 = 0.0;
				t1 = 1.0;
				t2 = x;
				if (t2 < t0) return t0;
				if (t2 > t1) return t1;
				while (t0 < t1) {
					x2 = this.sampleCurveX(t2);
					if (Math.abs(x2 - x) < epsilon)
						return t2;
					if (x > x2) t0 = t2;
					else t1 = t2;
					t2 = (t1 - t0) * .5 + t0;
				}
				return t2;
		},
		solve:function(x,epsilon) {
		   	return this.sampleCurveY(this.solveCurveX(x,epsilon));
		}
	}
	var defaultPattern={
			ease:new UnitBezier(0.25,0.1,0.25,1),
			linear:new UnitBezier(0,0,1,1),
			easeIn:new UnitBezier(0.42,0,1,1),
			easeOut:new UnitBezier(0, 0, 0.58, 1),
			easeInOut:new UnitBezier(0.42, 0, 0.58, 1)
	}
	var speedPattern=function(){
		if(arguments.length===1&&typeof(arguments[0])==='string'){
			var Bezier=defaultPattern[arguments[0]];
		}
		else if(arguments[0].length===4){
			var Bezier=new UnitBezier(arguments[0][0],arguments[0][1],arguments[0][2],arguments[0][3]);
			for(var i=0;i<4;i++){
				if(typeof(arguments[0][i])!='number'||arguments[0][i]<0||arguments[0][i]>1){
					var Bezier=defaultPattern['linear'];
				}
			}
		}
		return function(curTime,startValue,endValue,duration){
			return  Bezier.solve(curTime/duration,UnitBezier.prototype.epsilon)*(endValue-startValue)+startValue;
		}
	}
	function animate(){
		this.dom=null;
		this.startTime=0;
		this.startValue=[];
		this.endValue=[];
		this.propertyName=[];
		this.suffix=[];
		this.easing=null;
		this.duration=null;
		this.func=null;
		this.args=null;
		this.prefix=[];
	}
	animate.prototype={
		constructor:animate,
		init:function(dom){
			this.dom=dom;
		},
		start:function(rules,duration,easing){
			this.startTime=+new Date;
			this.duration=duration;
			this.easing=speedPattern(easing);
			var self=this;
			for(var i=0,len=rules.length;i<len;i++){
				(function(t){
					var ruleDate=ruleHandler(self.dom,rules[t]);
					self.prefix[t]=ruleDate.prefix;
					self.suffix[t]=ruleDate.suffix;
					self.propertyName[t]=ruleDate.name;
					self.endValue[t]=ruleDate.endValue;
					self.startValue[t]=ruleDate.startValue;
				})(i);
			}
			var go=function(){
				var t=+new Date;
				if(t>=self.startTime+self.duration){
					for(var i=0,len=rules.length;i<len;i++){
						self.dom.style[self.propertyName[i]]=self.prefix[i]+self.endValue[i]+self.suffix[i];
					}
					if(self.func){
						self.func(self.args);
					}
					return false;
				}
				else{
					var cur=[];
					for(var i=0,len=rules.length;i<len;i++){
							cur=curHandler(self.propertyName[i],self,self.prefix[i],t-self.startTime,self.startValue[i],self.endValue[i],self.duration);
							self.update(cur,self.propertyName[i],self.suffix[i],self.prefix[i]);
					}	
					setTimeout(function(){
						go();
					},13);
				}
			};
			go();
		},
		update:function(cur,propertyName,suffix,prefix){
			this.dom.style[propertyName]=prefix+cur+suffix;
			
		},
		callback:function(){
			this.func=Array.prototype.shift.apply(arguments);
			this.args=arguments;
		}
	}
	return function(){
		return new animate();
	}
})(); 	

