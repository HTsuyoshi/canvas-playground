<script setup lang='ts'>
	import Card from '../components/Card.vue'

	const project_1 = {
		title: 'Hover',
		link: '/canvas/hover',
		img: '/canvas/imgs/hover.png',
	}

	const project_2 = {
		title: 'Gravity',
		link: '/canvas/gravity',
		img: '/canvas/imgs/gravity.png',
	}
</script>

<template>
	<div id='background'>
		<h1>Canvas Projects</h1>
		<div id='card-list'>
			<Card :title='project_1.title' :link='project_1.link' :img='project_1.img'></Card>
			<Card :title='project_2.title' :link='project_2.link' :img='project_2.img'></Card>
		</div>
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
	color: #000000;
}
#card-list {
	display: flex;
	justify-content: center;
}
</style>
