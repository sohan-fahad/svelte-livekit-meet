<script lang="ts">
	import { RoomController } from '$src/presentation/controllers/room.controller';
	import { Room } from 'livekit-client';
	import { onMount } from 'svelte';

	export let isDeviceModal = false;
	export let closeModal: () => void;
	export let room: Room | undefined;
	const elementMapping: { [k: string]: MediaDeviceKind } = {
		'video-input': 'videoinput',
		'audio-input': 'audioinput',
		'audio-output': 'audiooutput'
	};

	let defaultDevices = new Map<MediaDeviceKind, string>();

	onMount(() => {
		acquireDeviceList();
	});

	const handleDeviceSelected = async (e) => {
		const deviceId = (<HTMLSelectElement>e.target).value;
		const elementId = (<HTMLSelectElement>e.target).id;
		const kind = elementMapping[elementId];

		if (kind === 'videoinput') {
			this.selectedVideoDevice = deviceId;
		} else if (kind === 'audioinput') {
			this.selectedAudioDevice = deviceId;
		} else if (kind === 'audiooutput') {
			this.selectedOutputDevice = deviceId;
		} else {
			return;
		}

		defaultDevices.set(kind, deviceId);

		if (room) {
			await room.switchActiveDevice(kind, deviceId);
		}
	};

	const acquireDeviceList = () => {
		RoomController.handleDevicesChanged();
	};
</script>

<div class="device-modal" class:active={isDeviceModal}>
	<div class="w-full">
		<label for="video-input">Video input devices</label>
		<select id="video-input" on:change={handleDeviceSelected} />
	</div>

	<div class="mt-4 w-full overflow-hidden">
		<label for="audio-input">Audio input device</label>
		<select id="audio-input" on:change={handleDeviceSelected} />
	</div>

	<div class="mt-4 w-full overflow-hidden">
		<label for="audio-output">Audio output devices</label>
		<select id="audio-output" on:change={handleDeviceSelected} />
	</div>

	<div class="flex justify-end mt-4">
		<button class="bg-primary text-white px-5 py-2 rounded-md w-full" on:click={closeModal}
			>Close</button
		>
	</div>
</div>

<style lang="postcss">
	.device-modal {
		@apply fixed z-30 top-5 sm:top-3 left-[5%] w-[90%] sm:left-1/4 lg:left-1/3 p-5 bg-white sm:w-96 rounded-md opacity-0;
		transform: scale(0.9);
		transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;

		select {
			@apply px-3 py-2 border-[1px] border-black w-full rounded-md mt-2;
		}
	}
	.device-modal.active {
		opacity: 1;
		visibility: visible;
		transform: scale(1);
		transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
	}
</style>
