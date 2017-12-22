import DAT from 'dat-gui';
import { Color, VertexColors, NoColors } from 'three';
import params from './params.js'
export default class Gui extends DAT.GUI {
	constructor(materials){
		super({
			load: JSON,
			preset: 'Flow'
		});

		this.material = materials[1];
		this.trunkMaterial = materials[0];
		// this.materialB = materials[3];
		// this.trunkMaterialB = materials[2];
		// this.materialC = materials[5];
		// this.trunkMaterialC = materials[4];
		this.params = params;

		this.add(this.params, 'cameraSpeed', 0.0002, 0.0009).step(0.0001);
		this.add(this.params, 'stop');

		// First material GUI
		const mat = this.addFolder('Foliage Material');
		mat.closed = true;
		mat.add(this.params, 'vertex_colors').onChange(this._handleVertexColorChange(this.material));
		mat.addColor(this.params, 'color').onChange(this._handleColorChange(this.material.color));
		mat.addColor(this.params, 'emissive').onChange(this._handleColorChange(this.material.emissive));
		mat.add(this.params, 'metalness', 0.0, 1.0).onChange(val => {
			this.material.metalness = val;
		});
		mat.add(this.params, 'roughness', 0.0, 1.0).onChange(val => {
			this.material.roughness = val;
		});

		const tmat = this.addFolder('Trunk Material');
		tmat.closed = true;
		tmat.add(this.params, 'vertex_colorsT').onChange(this._handleVertexColorChange(this.trunkMaterial));
		tmat.addColor(this.params, 'colorT').onChange(this._handleColorChange(this.trunkMaterial.color));
		tmat.addColor(this.params, 'emissiveT').onChange(this._handleColorChange(this.trunkMaterial.emissive));
		tmat.add(this.params, 'metalnessT', 0.0, 1.0).onChange(val => {
			this.trunkMaterial.metalness = val;
		});
		tmat.add(this.params, 'roughnessT', 0.0, 1.0).onChange(val => {
			this.trunkMaterial.roughness = val;
		});

		// // Second material GUI
		// const matB = this.addFolder('Foliage Material B');
		// matB.closed = true;
		// matB.add(this.params, 'vertex_colors').onChange(this._handleVertexColorChange(this.materialB));
		// matB.addColor(this.params, 'color').onChange(this._handleColorChange(this.materialB.color));
		// matB.addColor(this.params, 'emissive').onChange(this._handleColorChange(this.materialB.emissive));
		// matB.add(this.params, 'metalness', 0.0, 1.0).onChange(val => {
		// 	this.materialB.metalness = val;
		// });
		// matB.add(this.params, 'roughness', 0.0, 1.0).onChange(val => {
		// 	this.materialB.roughness = val;
		// });

		// const tmatB = this.addFolder('Trunk Material B');
		// tmatB.closed = true;
		// tmatB.add(this.params, 'vertex_colorsT').onChange(this._handleVertexColorChange(this.trunkMaterialB));
		// tmatB.addColor(this.params, 'colorT').onChange(this._handleColorChange(this.trunkMaterialB.color));
		// tmatB.addColor(this.params, 'emissiveT').onChange(this._handleColorChange(this.trunkMaterialB.emissive));
		// tmatB.add(this.params, 'metalnessT', 0.0, 1.0).onChange(val => {
		// 	this.trunkMaterialB.metalness = val;
		// });
		// tmatB.add(this.params, 'roughnessT', 0.0, 1.0).onChange(val => {
		// 	this.trunkMaterialB.roughness = val;
		// });

		// //Third material GUI ONLY TWO MATERIALS FOR NOW
		// const matC = this.addFolder('Foliage Material C');
		// matC.closed = true;
		// matC.add(this.params, 'vertex_colors').onChange(this._handleVertexColorChange(this.materialC));
		// matC.addColor(this.params, 'color').onChange(this._handleColorChange(this.materialC.color));
		// matC.addColor(this.params, 'emissive').onChange(this._handleColorChange(this.materialC.emissive));
		// matC.add(this.params, 'metalness', 0.0, 1.0).onChange(val => {
		// 	this.materialC.metalness = val;
		// });
		// matC.add(this.params, 'roughness', 0.0, 1.0).onChange(val => {
		// 	this.materialC.roughness = val;
		// });

		// const tmatC = this.addFolder('Trunk Material C');
		// tmatC.closed = true;
		// tmatC.add(this.params, 'vertex_colorsT').onChange(this._handleVertexColorChange(this.trunkMaterialC));
		// tmatC.addColor(this.params, 'colorT').onChange(this._handleColorChange(this.trunkMaterialC.color));
		// tmatC.addColor(this.params, 'emissiveT').onChange(this._handleColorChange(this.trunkMaterialC.emissive));
		// tmatC.add(this.params, 'metalnessT', 0.0, 1.0).onChange(val => {
		// 	this.trunkMaterialC.metalness = val;
		// });
		// tmatC.add(this.params, 'roughnessT', 0.0, 1.0).onChange(val => {
		// 	this.trunkMaterialC.roughness = val;
		// });
	}

	toggleHide(){
		DAT.GUI.toggleHide();
	}

	addMaterial(material){
		this.material = material;
	}

	// credtis to these methods goes to Greg Tatum https://threejs.org/docs/scenes/js/material.js
	addScene(scene, ambientLight, renderer){
		const folder = this.addFolder('Scene');
		const data = {
			'ambient light': ambientLight.color.getHex()
			//'ground Color': ambientLight.groundColor.getHex()
		};
		folder.addColor(data, 'ambient light').onChange(this._handleColorChange(ambientLight.color));
	}

	_handleColorChange(color){
		return function(value){
			if (typeof value === 'string'){
				value = value.replace('#', '0x');
			}
			color.setHex(value);
		};
	}

	_handleVertexColorChange(material){
		return value => {
			if (value === true){
				material.vertexColors = VertexColors;
			} else {
				material.vertexColors = NoColors;
			}
			material.needsUpdate = true;
		};
	}

	_onLightIntChange(){
		return function(value){
			this.ambientLight.intensity = value;
		};
	}
}
