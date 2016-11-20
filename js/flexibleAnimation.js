﻿//动画函数 0.5 by chen
//date:2016/11/20 21:47 
var flexibleAniamtion=(function(){
	function valueParse(value,property){
		var result='',
			pattern;
		if(property==='transform'){
			pattern=/[-]{0,}[0-9]{1,}[\.]{0,}[0-9]{0,}([e-][0-9]{0,}){0,}/g;	
		}
		if(property==='color'||property==='backgroundColor'){
			pattern=/[0-9]{1,}/g;
		}
		result=value.match(pattern);	
		return result;
	}

	//值处理
	function valueHander(self,startValue,endValue,curTime,duration,flag){
		var len=startValue.length,
			value=[];
			for(var i=0;i<len;i++){
				if(!flag){
					value[i]=self.easing(curTime,Number(startValue[i]),Number(endValue[i]),duration);	
				}
				else{
					value[i]=Math.floor(self.easing(curTime,Number(startValue[i]),Number(endValue[i]),duration));
				}
			}
		return value.join();
	}

	//转换为变形矩阵matrix
	function toStandardValue(value,property,obj){
		var doc=document,
			computedtyle=document.defaultView.getComputedStyle,
			value;
		if(!obj){
			var testDiv=doc.createElement('div');
			testDiv.style.cssText='height:0px;width:0px;opacity:0;position:absolute;';
			doc.body.appendChild(testDiv);
			testDiv.style[property]=value;
			value=computedtyle(testDiv,null)[property];
			doc.body.removeChild(testDiv);
		}
		else{
			value=computedtyle(obj,null)[property];	

		}
		return valueParse(value,property);
	}
	//获取动画执行的当前阶段的对应的属性值
	function curHandler(propertyName,self,prefix,curTime,startValue,endValue,duration){
		if(propertyName==='transform'){
			return  valueHander(self,startValue,endValue,curTime,duration,false);
		}
		if(propertyName==='background-color'){
			return valueHander(self,startValue,endValue,curTime,duration,true);
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
			ruleObj.endValue=toStandardValue(rules[1],rules[0],null);
			ruleObj.startValue=toStandardValue('',rules[0],obj);
		}
		else if(rules[0]=='color'||rules[0]=='backgroundColor'){
				ruleObj.prefix='rgb(';
				ruleObj.suffix=')';
				ruleObj.endValue=toStandardValue(rules[1],rules[0],null);
				ruleObj.startValue=toStandardValue('',rules[0],obj);
				if(rules[0]==='backgroundColor'){
					rules[0]='background-color';
				}
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
		sampleCurveY:function(t){
		   	return ((this.ay*t+this.by)*t+this.cy)*t;
		},
		sampleCurveDerivativeX:function(t) {//贝赛尔曲线t时刻的坐标点的Y坐标
		    return (3.0*this.ax*t+2.0*this.bx)*t+this.cx;
		},
		solveCurveX:function(x,epsilon) {
				var t0,
					t1,
					t2,
					x2,
					d2,
					i;
				for (t2=x,i=0;i<8;i++) {
				    x2= this.sampleCurveX(t2)-x;
				    if(Math.abs (x2)<epsilon)
				        return t2;
				    d2=this.sampleCurveDerivativeX(t2);
				    if(Math.abs(d2)<epsilon)
				        break;
				    t2=t2-x2/d2;
				}
				t0=0.0;
				t1=1.0;
				t2=x;
				if(t2<t0) return t0;
				if(t2>t1) return t1;
				while (t0<t1) {
					x2=this.sampleCurveX(t2);
					if (Math.abs(x2-x)<epsilon)
						return t2;
					if (x>x2) t0=t2;
					else t1=t2;
					t2=(t1-t0)*.5+t0;
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
			easeOut:new UnitBezier(0,0,0.58,1),
			easeInOut:new UnitBezier(0.42,0,0.58,1)
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
				var ruleDate=ruleHandler(self.dom,rules[i]);
				self.prefix[i]=ruleDate.prefix;
				self.suffix[i]=ruleDate.suffix;
				self.propertyName[i]=ruleDate.name;
				self.endValue[i]=ruleDate.endValue;
				self.startValue[i]=ruleDate.startValue;
			}
			var go=function(){
				var t=+new Date(),
					result='';
				if(t>=self.startTime+self.duration){
					for(var i=0,len=rules.length;i<len;i++){
						result=self.propertyName[i]+':'+self.prefix[i]+self.endValue[i]+self.suffix[i]+';'+result;		
					}
					self.dom.style.cssText=result;
					if(self.func){
						self.func(self.args);
					}
					return false;
				}
				else{
					var cur=[];
					for(var i=0,len=rules.length;i<len;i++){
							cur=curHandler(self.propertyName[i],self,self.prefix[i],t-self.startTime,self.startValue[i],self.endValue[i],self.duration);
							result=self.propertyName[i]+':'+self.prefix[i]+cur+self.suffix[i]+';'+result;
					}	
					self.dom.style.cssText=result;
					requestAnimationFrame(function(){
						go();
					});
				}
			};
			go();
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
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(func) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { func(); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());