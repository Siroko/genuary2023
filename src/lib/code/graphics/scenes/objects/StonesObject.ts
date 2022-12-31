/**
 * Copyright 2022 Felix Martinez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"),to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 import { Mesh, MeshNormalMaterial, MeshStandardMaterial, Object3D, TextureLoader } from 'three'
 import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader'
 
 class StonesObject extends Object3D {
 
   constructor() {
    super()
    this.setup();
   }
   
   private setup(): void {
    const loader = new GLTFLoader();
    const tl = new TextureLoader()
    // Load a glTF resource
    loader.load(
        // resource URL
        './assets/geometries/rocks_UV_floor_small.glb',
        (gltf: GLTF) => {
            this.add( gltf.scene );
            gltf.scene.traverse((obj) => {
                console.log(obj)
                if(obj.type === 'Mesh'){
                    if(obj.name.includes('Icosphere')){
                        const material = ((obj as Mesh).material as MeshStandardMaterial)
                        material.map = tl.load('./assets/textures/RocksAO.jpg')
                        material.roughness = 1
                        material.metalness = 0
                    }

                    if(obj.name.includes('Plane')){
                        const material = ((obj as Mesh).material as MeshStandardMaterial)
                        material.map = tl.load('./assets/textures/floor_AO.jpg')
                        material.aoMapIntensity = 1
                        material.roughness = 1
                        material.metalness = 0
                        material.color.set(0xFFFF00)
                    }
                }
            })
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
        },
        // called while loading is progressing
        (xhr) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        (error) => {
            console.log( 'An error happened', error );
        }
    );
   }
 }
 
 export default StonesObject
 