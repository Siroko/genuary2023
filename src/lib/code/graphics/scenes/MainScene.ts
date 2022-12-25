/**
 * Copyright 2021 Felix Martinez
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

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { BoxGeometry, Mesh, MeshNormalMaterial, Vector2 } from 'three'
import ThreeBase from '../core/ThreeBase'
import GPURendering from '../gpu/sim/GPURendering'
import GPUSimulation from '../gpu/sim/GPUSimulation'

class MainScene extends ThreeBase {
  private rafHandler: any
  private raf?: number
  private controls?: OrbitControls
  private debug = true
  private gpuSimulation?: GPUSimulation
  private gpuRendering?: GPURendering
  private composer?: EffectComposer
  private bloomPass?: UnrealBloomPass
  private pane?: Pane

  constructor(width: number, height: number, container: Element) {
    super(width, height, container)
    this.rafHandler = this.update.bind(this)
    this.events()
    this.setup().then(() => {
      this.setupControls()
      this.setupPostprocessing()
      this.setupGui()
      this.update()
    })
  }

  public resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.composer?.setSize(window.innerWidth, window.innerHeight)
  }

  private events() {
    window.addEventListener('visibilitychange', () => {
      this.clock.getDelta()
    })
  }

  private update(): void {
    this.raf = requestAnimationFrame(this.rafHandler)
    this.controls?.update()
    this.gpuSimulation?.update()
    this.gpuRendering?.update()
    this.composer!.render()
  }

  private setup(): Promise<void> {
    return new Promise(resolve => {
      this.renderer.setClearColor(0x222222)
      const loader = new OBJLoader()
      loader.loadAsync('./assets/geometries/asteroid.obj').then((mesh: { children: any[] }) => {
        this.gpuSimulation = new GPUSimulation(8192, this.renderer, this.clock)
        this.gpuRendering = new GPURendering(this.gpuSimulation, (mesh.children[0] as Mesh).geometry)
        this.scene.add(this.gpuSimulation)
        this.scene.add(this.gpuRendering)
        resolve()
      })
    })
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.dampingFactor = 0.09
    this.controls.enableDamping = true
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 100
    this.controls.maxDistance = 1400
    this.controls.maxPolarAngle = Math.PI / 2
    this.controls.rotateSpeed = 0.5
    this.controls.target.y = 0
  }

  private setupPostprocessing() {
    this.composer = new EffectComposer(this.renderer)
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4))
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.8,
      0.59,
      0.438
    )
    this.composer.addPass(this.bloomPass)
  }

  private setupGui() {
    const pane = new Pane({ expanded: true })
    pane.element.parentElement!.style.display = 'none'
    this.pane = pane
    
    pane.addInput(this.gpuSimulation!, 'alignFactor', {
      min: 0,
      max: 3,
      step: 0.001,
    })
    pane.addInput(this.gpuSimulation!, 'cohesionFactor', {
      min: 0,
      max: 3,
      step: 0.001,
    })
    pane.addInput(this.gpuSimulation!, 'separationFactor', {
      min: 1,
      max: 10,
      step: 0.001,
    })
    pane.addInput(this.gpuSimulation!, 'forceToCenterFactor', {
      min: 0,
      max: 10.0,
      step: 0.00001,
    })
    pane.addInput(this.gpuSimulation!, 'maxSpeed', {
      min: 0,
      max: 400,
      step: 0.001,
    })
    pane.addInput(this.gpuSimulation!, 'maxForce', {
      min: 0,
      max: 40,
      step: 0.001,
    })
    pane.addInput(this.gpuSimulation!, 'range', {
      min: 0,
      max: 20,
      step: 0.001,
    })

    pane.addInput(this.bloomPass!, 'strength', {
      min: 0,
      max: 1,
      step: 0.001,
    })

    pane.addInput(this.bloomPass!, 'radius', {
      min: 0,
      max: 2,
      step: 0.001,
    })

    pane.addInput(this.bloomPass!, 'threshold', {
      min: 0,
      max: 2,
      step: 0.001,
    })

    window.addEventListener('dblclick', () => {
      if (this.debug) {
        pane.element.parentElement!.style.display = 'block'
      } else {
        pane.element.parentElement!.style.display = 'none'
      }
      this.debug = !this.debug
    })
  }
}

export default MainScene
