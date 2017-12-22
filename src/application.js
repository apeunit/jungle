/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import params from './params.js'
import Stats from 'stats.js';
import { createPath } from './path.js';
import Scenography from './scenography.js';
import Pool from './pool.js';
import { materials, makeMaterialBrighter } from './materials.js';
const OrbitControls = require('three-orbit-controls')(THREE);

import Emitter from 'wildemitter'
let controls
class Jungle {

	constructor (canvas, options) {
		if (!canvas) throw new Error('No canvas detected')
		this.canvas = canvas

		// for apeunit, increase this value if you want that the scene becomes
		// brighter in less time
		this.LIGHT_INCREASE = 0.01;

		//orbit controls is used just in the debug modus
		this.bgColor = new THREE.Color(0.1, 0.1, 0.1);
		this.clock = new THREE.Clock();
		this.done = false
		this.gui,
		this.scene,
		this.renderer,
		this.stats,
		this.pool,
		this.scenography,
		this.camera,
		this.spline,
		this.startTime,
		this.sprite,
		this.light;

		//curve
		this.curveDensity = 600; // how many points define the path
		this.t = 0;
		this.radius = 200;
		this.radius_offset = 30;

		// objects
		this.poolSize = 12;
		this.percent_covered = 0.18; // it means that objects will be placed only in the
		// 18% part of the curve in front of the camera.

		// the distance_from_path defines how far away from the path a palm could be
		this.distance_from_path = 40;


	  this.options = {
      debug: false,
      redirect: false,
      redirectURL: 'http://www.apeunit.com/en/'
    }
    Object.assign(this.options, options)
	}


	prepareGeometries () {
		this.spline = createPath(this.radius, this.radius_offset);
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2( this.bgColor.getHex(), 0.012, 100 );
		this.scene.background = this.bgColor;
		this.pool = new Pool(this.poolSize, this.scene, this.spline, this.percent_covered, this.distance_from_path, materials);
		return this.pool;
	};

	init () {
		this.prepareGeometries();
		this.startTime = this.clock.getElapsedTime();
		this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.3, 260);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
		//renderer.setClearColor(0xff5050, 0); // the default
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		// document.body.style.margin = 0;
		// document.body.appendChild(renderer.domElement);
		
		this.light = new THREE.HemisphereLight(0xe8e8e8, 0x000000, 10);
		this.scene.add(this.light);

		if (this.options.debug) {
			controls = new OrbitControls(this.camera, this.renderer.domElement);			
		}

		this.addGui();

		//scenography
		this.fadeIn()
		this.scenography = new Scenography(this.camera, this.spline, this.t, params.cameraSpeed, this.fadeOut.bind(this));
		//stats
		// stats = new Stats();
		// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

		window.addEventListener('resize', () => {
			let WIDTH = window.innerWidth,
				HEIGHT = window.innerHeight;
			this.renderer.setSize(WIDTH, HEIGHT);
			this.camera.aspect = WIDTH / HEIGHT;
			this.camera.updateProjectionMatrix();
		});

		this.addStats();
		this.render();
	};

	render () {
		if (this.done || !this.renderer) return
		this.time = this.clock.getElapsedTime() - this.startTime;
		// stats.begin();
		this.scenography.update(params.cameraSpeed, params.stop, this.time);
		this.pool.update(this.scenography.getCameraPositionOnSpline());
		this.renderer && this.renderer.render(this.scene, this.camera);
		// stats.end();
		if (!this.done) requestAnimationFrame(this.render.bind(this));
	};

	addStats () {
		if (this.options.debug){
			document.body.appendChild(this.stats.domElement);
		}
	};

	addGui () {
		if (this.options.debug){
			this.gui = new Gui(materials);
			this.gui.addScene(this.scene, this.light, this.renderer);
		}
	};

	fadeIn () {
		if (this.bgColor.r > 1.0){
			this.bgColor.r -= this.LIGHT_INCREASE;
			this.bgColor.g -= this.LIGHT_INCREASE;
			this.bgColor.b -= this.LIGHT_INCREASE;
			this.renderer.setClearColor(this.bgColor.getHex());

			this.scene.fog.color.r -= this.LIGHT_INCREASE;
			this.scene.fog.color.g -= this.LIGHT_INCREASE;
			this.scene.fog.color.b -= this.LIGHT_INCREASE;

			for (let i = 0; i < materials.length; i++){
				makeMaterialBrighter(materials[i], (-1 * this.LIGHT_INCREASE));
			}
		}
	}

	fadeOut () {
		if (this.bgColor.r < 1.0){
			this.bgColor.r += this.LIGHT_INCREASE;
			this.bgColor.g += this.LIGHT_INCREASE;
			this.bgColor.b += this.LIGHT_INCREASE;
			this.renderer.setClearColor(this.bgColor.getHex());

			this.scene.fog.color.r += this.LIGHT_INCREASE;
			this.scene.fog.color.g += this.LIGHT_INCREASE;
			this.scene.fog.color.b += this.LIGHT_INCREASE;

			for (let i = 0; i < materials.length; i++){
				makeMaterialBrighter(materials[i], this.LIGHT_INCREASE);
			}
		} else if (this.options.redirect){
			window.location.replace(this.options.redirectURL);
		} else {
	    this.done = true
			this.renderer.forceContextLoss();
			this.renderer.context = null;
			this.renderer.domElement = null;
			this.renderer = null;
	    this.emit('complete');
		}
	};	
}

Emitter.mixin(Jungle);
export default Jungle

