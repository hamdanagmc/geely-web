declare module "panolens" {
    import type { PerspectiveCamera, Scene, WebGLRenderer } from "three"
  
    export class ImagePanorama {
      constructor(image: string)
    }
  
    export class Viewer {
      constructor(options: {
        container: HTMLElement
        autoRotate?: boolean
        autoRotateSpeed?: number
        controlBar?: boolean
        [key: string]: any
      })
      add(panorama: ImagePanorama): void
      dispose(): void
      getCamera(): PerspectiveCamera
      getScene(): Scene
      getRenderer(): WebGLRenderer
    }
  }
  
  