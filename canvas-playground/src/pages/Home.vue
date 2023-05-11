<script setup lang='ts'>
	import Card from '../components/Card.vue'

	const project_1 = {
		title: 'Balls',
		description: 'Project',
		link: '/canvas/balls',
		img: '/canvas/imgs/balls.png',
	}
</script>

<template>
	<div id="background">
		<h1>Canvas Projects</h1>
		<Card :title='project_1.title' :description='project_1.description' :link='project_1.link' :img='project_1.img'></Card>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Monoton&display=swap');
#background {
	width: 100vw;
	height: 100vh;
	background-color: #ffffff;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	font-size: 1.5em;
}
#background h1 {
	font-family: Monoton;
}
</style>
