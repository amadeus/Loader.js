/*
---

description: Loader

license: MIT-style

authors:
- Amadeus Demarzi (http://kiip.com/)

...
*/

(function(){

// Premature optimization? Probably
var PI = Math.PI;

var Loader = window.Loader = new Class({

	Implements: [Options, Events, Class.Binds],

	options: {
		width: 30,
		height: 30,
		backgroundColor: 'transparent',
		fps: 1000,
		duration: 250
	},

	degrees: 0,
	lastUpdate: 0,
	running: false,

	initialize: function(image, options){
		this.image = document.id(image).dispose();
		this.setOptions(options);
		if (this.options.autoInject) this.options.autoInject = document.id(this.options.autoInject);

		this.canvas = new Element('canvas', {
			width: this.options.width,
			height: this.options.height,
			style: {
				backgroundColor: this.options.backgroundColor,
				width: this.options.width,
				height: this.options.height
			}
		});

		this.image.setStyles({
			width: this.options.width,
			height: this.options.height
		});

		this.ctx = this.canvas.getContext('2d');
	},

	toElement: function(){
		return this.canvas;
	},

	start: function(container){
		if (this.running) return;
		this.running = true;
		var interval = 1000 / this.options.fps;
		if (typeOf(container) === 'element') this.canvas.inject(container);
		else if (this.options.autoInject) this.canvas.inject(this.options.autoInject);
		clearInterval(this.timer);
		this.lastUpdate = Date.now();
		this.timer = setInterval(this.bound('update'), interval);
	},

	stop: function(){
		this.pause();
		this.degrees = 0;
		Loader.drawImage(this.image, this.degrees, this.ctx, this.options.width, this.options.height);
		if (this.options.autoInject) this.canvas.dispose();
	},

	pause: function(){
		this.running = false;
		clearInterval(this.timer);
	},

	update: function(){
		var now = Date.now(),
			delta = now - this.lastUpdate,
			percentage = delta / this.options.duration;

		this.degrees += 360 * percentage;
		if (this.degrees > 360) this.degrees -= 360;

		Loader.drawImage(this.image, this.degrees, this.ctx, this.options.width, this.options.height);
		this.lastUpdate = now;
	}

});

Loader.extend({

	drawImage: function(image, degrees, ctx, width, height){
		ctx.clearRect(0, 0, width, height);
		ctx.save();
		var hWidth = width/2,
			hHeight = height/2;

		ctx.translate(hWidth, hHeight);
		ctx.rotate(degrees * PI / 180);

		ctx.drawImage(image, -(hWidth), -(hHeight), width, height);
		ctx.restore();
	}

});

}).call(this);
