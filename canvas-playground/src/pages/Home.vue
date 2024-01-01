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

	const project_5 = {
		title: 'Life',
		link: '/canvas/life',
		img: '/canvas/imgs/life.png',
	}

	const project_6 = {
		title: 'Snake',
		link: '/canvas/snake',
		img: '/canvas/imgs/snake.png',
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
			<Card :title='project_5.title' :link='project_5.link' :img='project_5.img'></Card>
			<Card :title='project_6.title' :link='project_6.link' :img='project_6.img'></Card>
		</div>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Monoton&display=swap');
#background {
	background-color: #ffffff;

	min-height: 100svh;
	min-width: 100svw;

	display: flex;
	justify-content: space-evenly;
	flex-direction: column;

	font-size: 1.5em;
}
#background h1 {
	font-family: Monoton;
	color: #000000;
	margin: 1em;
	text-align: center;
}
#card-list {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
#background {
	background:
		linear-gradient(#fff 0.15em, transparent 0),
		linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
		linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),
		#fff;
	background-size: 100% 6px, 109px 109px, 109px 109px;
	background-position: 0px 0px, 0px 0px, 0px 0px;
}
</style>
