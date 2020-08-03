import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
@Component({
  selector: 'app-threeloader',
  templateUrl: './threeloader.component.html',
  styleUrls: ['./threeloader.component.css'],
})
export class ThreeloaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.bike();
  }

  bike = () => {
    window.addEventListener('resize', onWindowResize);

    function changeFrameColor(e) {
      let element = e.target.id;
      let frame;
      if (element === 'black') {
        frame = new THREE.MeshPhongMaterial({
          color: 0x000000,
        });
      }
      if (element === 'light') {
        frame = new THREE.MeshPhongMaterial({
          color: 0x767676,
        });
      }
      initFrame(bike, frame);
    }

    var camera, scene, renderer, bike;

    let container = document.getElementById('container');

    // scene

    scene = new THREE.Scene();

    // background

    scene.background = new THREE.Color(0xd8d8d8);

    // renderer

    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // camera

    camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      5,
      17000
    );
    scene.add(camera);
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.;
    // controls.rotateSpeed = 0.7;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 2;
    let loader = new GLTFLoader();
    let url = '/assets/3d/bike.glb';

    const TYRE_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });
    const FRAME_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });
    // tmps are dust caps in tyre
    const TMPS_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    const LOCK_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // glass

    const GLASS_MTL = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });

    // front panel

    const FRONT_PANEL_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // front lock

    const FRONT_LOCK_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // mud gaurd center mount

    const MUDGUARD_MOUNT_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // mid frame color

    const MID_FRAME_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // chain link color

    const CHAINLINK_MTL = new THREE.MeshPhongMaterial({
      color: 0x808080,
    });

    // front mudgaurd mount cad
    const FRONT_MUDCAD_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // battery lock
    const BATTERY_LOCK_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // disc

    const DISC_MTL = new THREE.MeshPhongMaterial({
      color: 0xc0c0c0,
    });

    // rim material

    const RIM_MTL = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });

    // reflector material

    const REFLECTOR_MTL = new THREE.MeshPhongMaterial({
      color: 0xcc0000,
    });

    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    loader.setDRACOLoader(dracoLoader);
    loader.loadAsync(url).then(function (gltf) {
      bike = gltf.scene;

      bike.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          if (o.material.map) {
            o.material.map.anisotropy = 16;
          }
        }
      });

      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject(bike);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      camera.position.y = center.y - 500;
      camera.position.x = center.x + 700;
      camera.updateProjectionMatrix();
      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      const fov = camera.fov * (Math.PI / 180);
      const maxDim = Math.max(size.x, size.y, size.z);
      let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

      camera.position.z = cameraZ + 550;
      camera.updateProjectionMatrix();
      bike.position.setY(-500);
      bike.position.setZ(-50);
      camera.lookAt(center);

      initColor(bike, TYRE_MTL);
      initFrame(bike, FRAME_MTL);

      scene.add(gltf.scene);
    });

    function initFrame(parent, mtl) {
      parent.traverse((o) => {
        if (o.name === 'frame') {
          o.material = mtl;
        }
        if (o.name === 'handle') {
          o.material = mtl;
        }
        if (o.name === 'handle_grip') {
          o.material = mtl;
        }
      });
    }

    function initColor(parent, mtl) {
      parent.traverse((o) => {
        if (o.name === 'ttyre') {
          o.material = mtl;
        }
        if (o.name === 'battery_lock') {
          o.material = BATTERY_LOCK_MTL;
          o.material.visible = false;
        }
        if (o.name === 'tmps') {
          o.material = TMPS_MTL;
        }
        if (o.name === 'lock_1') {
          o.material = LOCK_MTL;
        }
        if (o.name === 'glass') {
          o.material = GLASS_MTL;
        }
        if (o.name === 'front_plate_front_-_Copy_-_Copy') {
          o.material = FRONT_PANEL_MTL;
        }
        if (o.name === 'lock') {
          o.material = FRONT_LOCK_MTL;
        }
        if (o.name === 'front_mudguard_center_mount_20') {
          o.material = MUDGUARD_MOUNT_MTL;
        }
        if (o.name === 'frame_-_Copy_(2)') {
          o.material = MID_FRAME_MTL;
        }
        if (o.name === 'chainlink') {
          o.material = CHAINLINK_MTL;
        }
        if (o.name === 'front_mudguard_mount_1') {
          o.material = FRONT_MUDCAD_MTL;
        }
        if (o.name === 'steering_cap_reno') {
          o.material = mtl;
        }
        if (o.name === 'front_mudguard_mount_cad') {
          o.material = FRONT_MUDCAD_MTL;
        }

        if (o.name === 'Remgreep_Saccon') {
          o.material = mtl;
        }
        if (o.name === 'seat') {
          o.material = mtl;
        }

        if (o.name === 'rear_clamp_disc') {
          o.material = mtl;
        }
        if (o.name === '3D') {
          o.material = mtl;
        }
        if (o.name === 'disc') {
          o.material = DISC_MTL;
        }
        if (o.name === 'front_clamp') {
          o.material = mtl;
        }

        if (o.name === 'rim') {
          o.material = RIM_MTL;
        }

        if (o.name === 'rear_mudguard_center_mount_20') {
          o.material = MUDGUARD_MOUNT_MTL;
        }

        if (o.name === 'mudguard_front_3') {
          o.material = mtl;
        }
        if (o.name === 'mudguard_rear_3') {
          o.material = mtl;
        }
        if (o.name === 'battery_outer_case') {
          o.material = mtl;
        }
        if (o.name === 'peg') {
          o.material = mtl;
        }
        if (o.name === 'rear_mudguard_mount_cad') {
          o.material = mtl;
        }
        if (o.name === 'calliper') {
          o.material = mtl;
        }
        if (o.name === 'rear_clamp') {
          o.material = mtl;
        }
        if (o.name === 'socket_head_cap_screw_am') {
          o.material = mtl;
        }
        if (o.name === 'Reflector') {
          o.material = REFLECTOR_MTL;
        }
        if (o.name === 'front_disc_mount') {
          o.material = mtl;
        }
        if (o.name === 'front_brake_liner') {
          o.material = mtl;
        }
        if (o.name === 'rear_brake_liner') {
          o.material = mtl;
        }
        if (o.name === 'adapter_A_F160_R140') {
          o.material = mtl;
        }
        if (o.name === 'rear_shaft_wheel_20') {
          o.material = mtl;
        }
        if (o.name === 'front_shaft_wheel_20') {
          o.material = mtl;
        }
        if (o.name === 'SF-MX30_Shimano_Freewheel') {
          o.material = mtl;
        }
        if (o.name === 'socket_head_cap_screw_is') {
          o.material = mtl;
        }
        if (o.name === 'hex_flange_nut_am') {
          o.material = mtl;
        }
        if (o.name === 'inner_battery_case') {
          o.material = mtl;
        }
        if (o.name === 'mudguard_rear_mount_2') {
          o.material = mtl;
        }
        if (o.name === 'hex_flange_nut_am') {
          o.material = mtl;
        }
        if (o.name === 'lock_nut_is') {
          o.material = mtl;
        }
      });
    }

    let dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.position.set(0, 900, 0);
    dirLight.castShadow = true;
    scene.add(dirLight);

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let l1 = new THREE.PointLight(0xc4c4c4, 1);
    l1.position.set(0, 300, 500);
    scene.add(l1);

    let l2 = new THREE.PointLight(0xc4c4c4, 1);
    l2.position.set(500, 100, 0);
    scene.add(l2);

    let l3 = new THREE.PointLight(0xc4c4c4, 1);
    l3.position.set(0, 100, -500);
    scene.add(l3);

    let l4 = new THREE.PointLight(0xc4c4c4, 1);
    l4.position.set(-500, 300, 0);
    scene.add(l4);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    }

    animate();

    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  };
}