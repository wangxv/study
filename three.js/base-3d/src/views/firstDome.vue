<template>
  <div class='first-dome'>
    <div ref="box"></div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
  name: 'FirstDome',
})
export default class FirstDome extends Vue {
  scene = new THREE.Scene();

  mounted() {
    this.init();
  }

  init() {
    const { box }: any = this.$refs;
    if (!box) return;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    box.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry1 = new THREE.RingGeometry(1, 2, 32); // 内部半径，外部半径， 圆环的分段数
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const materia1 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const cube = new THREE.Mesh(geometry, material);
    const cube1 = new THREE.Mesh(geometry1, materia1);
    this.scene.add(cube);
    this.scene.add(cube1);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(this.scene, camera);
    };
    animate();
  }
}
</script>
<style lang='less' scoped>
.first-dome{
  box-sizing: border-box
}
</style>
