<script setup lang='ts'>
	defineProps({
		title: {
			type: String,
			required: true
		},
		img: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		}
	});
</script>

<template>
	<router-link :to='link' >
	<div class='card'>
		<img :src='img'>
		<p>{{ title }}</p>
	</div>
	</router-link>
</template>

<style scoped>
a {
	text-decoration: none;
	color: #fafafa;
}
.card {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	color: #fafafa;

	background-color: #222222;
    box-shadow: #aaaaaa 5px 5px 10px 5px;
	
	transition: transform .2s ease-out;

	margin: 1em;
}
.card:hover {
	transform: translate(0, 0.4em);
}
.card img {
	width: 6em;
	height: 6em;
}
</style>
