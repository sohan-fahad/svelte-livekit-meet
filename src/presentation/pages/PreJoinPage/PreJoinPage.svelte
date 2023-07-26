<script lang="ts">
	import GazeIcon from '$src/presentation/common/icons/GazeIcon.svelte';
	import { LocalVideoTrack, createLocalVideoTrack, Room } from 'livekit-client';
	import { onDestroy, onMount } from 'svelte';
	import PreJoinForm from './components/PreJoinForm.svelte';
	import { eraseCookie } from '$src/utils/cookie';
	import { MediaDeviceStore } from '$src/stores/media-device.store';

	let isVideoEnable = false;
	let isAudioEnable = true;
	let videoTrack: LocalVideoTrack | undefined;
	let videoDevice: MediaDeviceInfo;

	let videoRef: HTMLVideoElement;
	let cameraBgRef: HTMLElement;

	let deviceKinds = ['videoinput', 'audioinput', 'audiooutput'];

	onMount(() => {
		MediaDeviceStore.reset();
		aquireDevices();
		// eraseCookie('token');
	});

	const createTrack = (deviceId) => {
		createLocalVideoTrack({
			deviceId
		}).then((track) => {
			isVideoEnable = true;
			videoTrack = track;
			videoTrack.attach(videoRef);
			resize();
		});
	};

	const aquireDevices = async () => {
		deviceKinds.forEach(async (kind: any) => {
			const devices = await Room.getLocalDevices(kind);
			if (kind == 'videoinput') {
				selectVideoDevice(devices[0]);
				createTrack(devices[0].deviceId);
				MediaDeviceStore.updateStore({ isCameraEnable: true });
				MediaDeviceStore.updateSelectedDevice({ videoinput: devices[0] });
			} else if (kind == 'audioinput') {
				MediaDeviceStore.updateSelectedDevice({ audioinput: devices[0] });
			} else {
				MediaDeviceStore.updateSelectedDevice({ audiooutput: devices[0] });
			}
			populateDevice(devices, kind, devices[0].deviceId);
		});
	};

	const populateDevice = (
		devices: MediaDeviceInfo[],
		elementId: string,
		selectedDeviceId?: string
	) => {
		const element = document.getElementById(elementId);
		element.innerHTML = '';
		devices.forEach((device) => {
			const option = document.createElement('option');
			option.text = device.label;
			option.value = device.deviceId;
			if (selectedDeviceId === device.deviceId) {
				option.selected = true;
			}
			element.appendChild(option);
		});
	};

	const selectVideoDevice = (device: MediaDeviceInfo) => {
		videoDevice = device;
		if (videoTrack) {
			if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
				return;
			}
			// stop video
			videoTrack.stop();
		}
	};

	const toggleVideo = async () => {
		cameraBgRef.style.width = `${videoRef.offsetWidth}px`;
		cameraBgRef.style.height = `${videoRef.offsetHeight}px`;
		if (videoTrack) {
			videoTrack.stop();
			MediaDeviceStore.updateStore({ isCameraEnable: false });
			isVideoEnable = false;
			videoTrack = undefined;
			cameraBgRef.style.display = 'flex';
		} else {
			cameraBgRef.style.display = 'none';
			const track = await createLocalVideoTrack({
				deviceId: videoDevice?.deviceId
			});

			isVideoEnable = true;
			videoTrack = track;
			videoTrack.attach(videoRef);
			MediaDeviceStore.updateStore({ isCameraEnable: true });
		}
	};

	const toggleAudio = () => {
		isAudioEnable = !isAudioEnable;
		MediaDeviceStore.updateStore({ isAudioEnable: isAudioEnable });
	};

	const resize = () => {
		const width = videoRef.offsetWidth;
		videoRef.style.width = width + 'px';
		videoRef.style.height = (width * 9) / 16 + 'px';
	};

	const handleDeviceChange = (e) => {
		const id = e.target.id;
		const deviceInfo = {
			kind: id,
			deviceId: e.target.value
		};

		if (id == 'videoinput') {
			MediaDeviceStore.updateSelectedDevice({ videoinput: deviceInfo });
		} else if (id == 'audioinput') {
			MediaDeviceStore.updateSelectedDevice({ audioinput: deviceInfo });
		} else {
			MediaDeviceStore.updateSelectedDevice({ audiooutput: deviceInfo });
		}
	};

	onDestroy(() => {
		if (videoTrack) {
			videoTrack.stop();
		}
	});
</script>

<div class="prejoin">
	<div class="prejoin-wrapper">
		<div class="media-wrapper">
			<div class="video-wrapper">
				<!-- svelte-ignore a11y-media-has-caption -->
				<video bind:this={videoRef} />
				<div
					class="hidden absolute left-0 top-0 bg-secondary justify-center items-center rounded-md"
					bind:this={cameraBgRef}
				>
					<p class="text-white text-lg">Camera is off</p>
				</div>
				<div class="devices">
					<button
						on:click={toggleVideo}
						class:active={!isVideoEnable}
						class:inactive={isVideoEnable}
					>
						<GazeIcon icon={isVideoEnable ? 'video-on' : 'video-off'} />
					</button>
					<button
						on:click={toggleAudio}
						class:active={!isAudioEnable}
						class:inactive={isAudioEnable}
					>
						<GazeIcon icon={isAudioEnable ? 'mic-on' : 'mic-off'} />
					</button>
				</div>
			</div>
			<div class="media-devices">
				<select id="videoinput" on:change={handleDeviceChange} />
				<select id="audioinput" on:change={handleDeviceChange} />
				<select id="audiooutput" on:change={handleDeviceChange} />
			</div>
		</div>
		<div class="form-wrapper">
			<PreJoinForm />
		</div>
	</div>
</div>

<style lang="postcss">
	.prejoin {
		@apply h-full w-full max-w-lg mx-auto flex justify-center items-center;
		.prejoin-wrapper {
			@apply w-full;
			.media-wrapper {
				@apply h-auto relative w-full overflow-hidden inline-block p-5;

				.video-wrapper {
					@apply overflow-hidden relative;
					video {
						@apply w-full left-0 bg-secondary rounded-md overflow-hidden object-contain bg-cover;

						transform: rotateY(180deg);
						-webkit-transform: rotateY(180deg); /* Safari and Chrome */
						-moz-transform: rotateY(180deg); /* Firefox */
					}

					.devices {
						@apply absolute left-0 bottom-2 gap-2 w-full flex justify-center;

						button {
							@apply h-10 w-10 rounded-full  transition-all;
						}

						button.inactive {
							@apply bg-primary hover:bg-secondary;
						}

						button.active {
							@apply bg-red-700;
						}
					}
				}

				.media-devices {
					@apply h-auto w-full flex justify-center items-center gap-1 lg:gap-2 relative mt-5;

					select {
						@apply w-1/3 p-2 rounded-md bg-secondary text-white text-xs sm:text-sm;
					}
				}
			}

			.form-wrapper {
				@apply h-auto lg:h-full;
			}
		}
	}
</style>
