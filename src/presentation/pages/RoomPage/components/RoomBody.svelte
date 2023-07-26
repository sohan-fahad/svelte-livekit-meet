<script lang="ts">
	import Loader from '$src/presentation/components/Loader.svelte';
	import { RoomStore } from '$src/stores/room.store';
	import type { ConnectionStatusType, DeviceStatus } from '$src/stores/room.store';
	import { onDestroy } from 'svelte';
	import RoomParticipants from './RoomParticipants.svelte';
	import RoomScreenShare from './RoomScreenShare.svelte';

	let connectionStatus: ConnectionStatusType;
	let deviceStatus: DeviceStatus;
	let isLoading = false;
	const RoomStoreSubs = RoomStore.select().subscribe((res) => {
		connectionStatus = res.connectionStatus;
		deviceStatus = res.deviceStatus;
		isLoading = res.isLoading;
	});

	onDestroy(() => {
		RoomStoreSubs.unsubscribe();
	});
</script>

<div class="room-body">
	{#if isLoading || (deviceStatus !== 'DEVICE_LOADED' && connectionStatus !== 'CONNECTED')}
		<Loader message="Connectioning to the room!" />
	{/if}
	<div id="conferenceArea" class="conference">
		<RoomScreenShare />
		<RoomParticipants />
	</div>
</div>

<style lang="postcss">
	.room-body {
		@apply flex flex-col p-0 lg:p-5 h-[calc(100vh-60px)] justify-center items-center relative;

		.conference {
			@apply h-full w-full flex flex-1 rounded-md gap-1 max-w-full max-h-full lg:flex-row flex-col justify-center items-center;
		}
	}
</style>
