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

	const project_3 = {
		title: 'Collision',
		link: '/canvas/collision',
		img: '/canvas/imgs/collision.png',
	}

	const project_4 = {
		title: 'Chaos',
		link: '/canvas/chaos',
		img: '/canvas/imgs/chaos.png',
	}
</script>

<template>
	<div id='background'>
		<h1>Canvas Projects</h1>
		<div id='card-list'>
			<Card :title='project_1.title' :link='project_1.link' :img='project_1.img'></Card>
			<Card :title='project_2.title' :link='project_2.link' :img='project_2.img'></Card>
			<Card :title='project_3.title' :link='project_3.link' :img='project_3.img'></Card>
			<Card :title='project_4.title' :link='project_4.link' :img='project_4.img'></Card>
		</div>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Monoton&display=swap');
#background {
	background-color: #ffffff;

	min-height: 100vh;
	min-width: 100vw;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex-wrap: wrap;

	font-size: 1.5em;
}
#background h1 {
	font-family: Monoton;
	color: #000000;
	margin: 0.2em;
	text-align: center;
}
#card-list {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
</style>
