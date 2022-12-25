<script lang="ts">
import Main from "../lib/code/graphics/scenes/MainScene";
import { onMount } from 'svelte';

let container: HTMLElement
async function init() {
	new Main(window.innerWidth, window.innerHeight, container)
}
onMount(init)
</script>

<main bind:this={container} />

<style>
main {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>