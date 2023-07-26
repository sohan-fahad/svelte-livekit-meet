<script>
	import { RoomStore } from '$src/stores/room.store';
	import { onDestroy } from 'svelte';

	let message = 'sssss';
	const RoomStoreSubs = RoomStore.select().subscribe((res) => {
		message = res.toastMessage;
	});

	onDestroy(() => {
		RoomStoreSubs.unsubscribe();
	});
</script>

<div id="simpleToast" class:show={message} class:hide={!message}>
	<span>{message}</span>
</div>

<style lang="postcss">
	/* The SIMPLE-TOAST - position it at the bottom and in the middle of the screen */
	#simpleToast {
		@apply max-w-xs bg-white rounded-sm shadow-2xl text-primary text-center px-4 py-2 fixed z-40 top-4 inline-flex transition-all text-xs sm:text-sm;
	}

	#simpleToast.show {
		@apply left-5;
	}

	#simpleToast.hide {
		@apply -left-96;
	}
</style>
