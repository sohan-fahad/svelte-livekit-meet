<script lang="ts">
	import GazeIcon from '$src/presentation/common/icons/GazeIcon.svelte';
	import Modal from '$src/presentation/components/modals/Modal.svelte';
	import RoomChatDrawer from './RoomChatDrawer.svelte';
	import RoomDeviceModal from './RoomDeviceModal.svelte';
	import { RoomStore } from '$src/stores/room.store';
	import { Room } from 'livekit-client';
	import { onDestroy } from 'svelte';
	import { MediaDeviceStore } from '$src/stores/media-device.store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { RoomController } from '$src/presentation/controllers/room.controller';

	let isChatModal = false;
	let isDeviceModal = false;
	let isAudio = true;
	let isVideo = true;
	let isScreenShare = false;
	let currentRoom: Room | undefined;

	const RoomStoreSubs = RoomStore.select().subscribe((res) => {
		isScreenShare = res.isScreenShare;
		currentRoom = res.currentRoom;
	});

	const MediaDeviceStoreSubs = MediaDeviceStore.select().subscribe((res) => {
		isAudio = res.isAudioEnable;
		isVideo = res.isCameraEnable;
	});

	const toggleChatModal = () => {
		if (!currentRoom) return;
		isChatModal = !isChatModal;
	};

	const toggleDeviceModal = () => {
		isDeviceModal = !isDeviceModal;
	};

	const audioAction = async () => {
		isAudio = !isAudio;
		if (!currentRoom) return;
		let enabled = currentRoom.localParticipant.isMicrophoneEnabled;
		isAudio = !enabled;
		MediaDeviceStore.updateStore({ isAudioEnable: isAudio });
		await currentRoom.localParticipant.setMicrophoneEnabled(!enabled);
	};

	const videoAction = async () => {
		if (!currentRoom) return;
		const enabled = currentRoom.localParticipant.isCameraEnabled;
		isVideo = !enabled;
		MediaDeviceStore.updateStore({ isCameraEnable: isVideo });
		await currentRoom.localParticipant.setCameraEnabled(!enabled);
	};

	const screenShareAction = async () => {
		try {
			if (!currentRoom) return;
			let enabled = currentRoom.localParticipant.isScreenShareEnabled;
			await currentRoom.localParticipant.setScreenShareEnabled(!enabled, { audio: true });
		} catch (error) {}
	};

	const closeAction = async () => {
		RoomController.disconnectRoom();
		await goto('/');
	};

	onDestroy(() => {
		RoomStoreSubs.unsubscribe();
		MediaDeviceStoreSubs.unsubscribe();
	});
</script>

<div class="room-footer">
	<button class="active" on:click={closeAction}>
		<GazeIcon icon="close-call" />
	</button>
	<button on:click={videoAction} class:active={!isVideo}>
		<GazeIcon icon={isVideo ? 'video-on' : 'video-off'} />
	</button>
	<button on:click={audioAction} class:active={!isAudio}>
		<GazeIcon icon={isAudio ? 'mic-on' : 'mic-off'} />
	</button>
	<button on:click={screenShareAction} class:active={isScreenShare}>
		<GazeIcon icon={isScreenShare ? 'screen-share-off' : 'screen-share-on'} />
	</button>
	<button on:click={toggleChatModal}>
		<GazeIcon icon="chat" />
	</button>
	<button on:click={toggleDeviceModal}>
		<GazeIcon icon="settings" />
	</button>
</div>

<Modal isOverlayActive={isChatModal} closeModal={toggleChatModal}>
	<RoomChatDrawer
		{isChatModal}
		closeChatModal={toggleChatModal}
		participantName={currentRoom ? currentRoom.localParticipant.name : ''}
	/>
</Modal>

<Modal isOverlayActive={isDeviceModal} closeModal={toggleDeviceModal}>
	<RoomDeviceModal
		{isDeviceModal}
		closeModal={toggleDeviceModal}
		room={currentRoom && currentRoom}
	/>
</Modal>

<style lang="postcss">
	.room-footer {
		@apply w-full h-[60px] flex justify-center items-center gap-3;

		button {
			@apply h-10 w-10 rounded-full bg-secondary transition-all hover:bg-slate-700;
		}

		button.active {
			@apply bg-red-700;
		}
	}
</style>
