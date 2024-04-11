import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Hover from './pages/Hover.vue'
import Gravity from './pages/Gravity.vue'
import Collision from './pages/Collision.vue'
import Chaos from './pages/Chaos.vue'
import Life from './pages/Life.vue'
import Snake from './pages/Snake.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [ {
			path: '/',
			name: 'CanvasHome',
			component: Home
		},
		{
			path: '/hover',
			name: 'Hover',
			component: Hover
		},
		{
			path: '/gravity',
			name: 'Gravity',
			component: Gravity
		},
		{
			path: '/collision',
			name: 'Collision',
			component: Collision
		},
		{
			path: '/chaos',
			name: 'Chaos',
			component: Chaos
		},
		{
			path: '/life',
			name: 'Life',
			component: Life
		},
		{
			path: '/snake',
			name: 'Snake',
			component: Snake
		}
	]
})

export default router;
