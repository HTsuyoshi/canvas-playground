import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Hover from './pages/Hover.vue'
import Gravity from './pages/Gravity.vue'
import Collision from './pages/Collision.vue'
import Chaos from './pages/Chaos.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/canvas',
			name: 'CanvasHome',
			component: Home
		},
		{
			path: '/canvas/hover',
			name: 'Hover',
			component: Hover
		},
		{
			path: '/canvas/gravity',
			name: 'Gravity',
			component: Gravity
		},
		{
			path: '/canvas/collision',
			name: 'Collision',
			component: Collision
		},
		{
			path: '/canvas/chaos',
			name: 'Chaos',
			component: Chaos
		},
	]
})

export default router;
