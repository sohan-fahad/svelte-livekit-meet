<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import RoomBody from './components/RoomBody.svelte';
	import RoomFooter from './components/RoomFooter.svelte';
	import { RoomController } from '$src/presentation/controllers/room.controller';
	import { RoomStore } from '$src/stores/room.store';
	import { Room } from 'livekit-client';
	import { RoomLayoutController } from '$src/presentation/controllers/room-layout.controller';
	import Toast from '$src/presentation/components/Toast.svelte';

	export let token = '';
	let room: Room;
	let listenersInitialized = false;
	let roomInitializationPromise;

	const RoomSubs = RoomStore.select().subscribe((res) => {
		room = res.currentRoom;
	});

	onMount(() => {
		if (token) {
			RoomLayoutController.setAspectRationByWidth();
			roomInitializationPromise = RoomController.initializingRoom(token)
				.then(() => (listenersInitialized = true))
				.catch((error) => {
					console.error('Failed to initialize listeners:', error);
				});
		}
	});

	onDestroy(async () => {
		if (roomInitializationPromise) {
			await roomInitializationPromise;
		}

		if (listenersInitialized) {
			if (room) room.disconnect();
		} else {
			console.warn('Listeners were not initialized before destroying the component.');
		}
		RoomSubs.unsubscribe();
	});
</script>

<div class="room">
	<RoomBody />
	<RoomFooter />
</div>
<Toast />

<style>
	.room {
		@apply h-full w-full;
	}
</style>
