<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { RoomApiService } from '$src/services/api/room.apiService';
	import { setCookie } from '$src/utils/cookie';
	import { onMount } from 'svelte';
	import * as jose from 'jose';
	import { ENV } from '$src/ENV';

	let participantName = '';
	let roomName = $page.url.searchParams.get('room');

	let isLoading = false;
	onMount(() => {});
	const getToken = async () => {
		isLoading = true;
		try {
			if (participantName && roomName) {
				const response = await RoomApiService.getToken(roomName, participantName);
				if (!response.success) return;
				setCookie('token', response.payload.token, 0.5);
				await goto(`/room/${roomName}`);
			}
		} catch (error) {
			alert(error.message);
		} finally {
			isLoading = false;
		}
	};

	const generateToken = async () => {
		isLoading = true;
		try {
			if (participantName && roomName) {
				const response = await RoomApiService.getToken(roomName, participantName);

				if (response.success) {
					setCookie('token', response.payload.token, 0.01);
					await goto(`/room/${roomName}`);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="prejoin-form-box">
	<form on:submit|preventDefault={generateToken}>
		<input type="text" placeholder="Enter name" bind:value={participantName} />
		<input type="text" placeholder="Enter room number" bind:value={roomName} />
		{#if isLoading}
			<button type="submit" disabled>Joining</button>
		{:else}
			<button type="submit" disabled={participantName && roomName ? false : true}>Join</button>
		{/if}
	</form>
</div>

<style lang="postcss">
	.prejoin-form-box {
		@apply w-full flex justify-center items-center px-5 pb-5;
	}
	form {
		@apply w-full flex flex-col gap-3 rounded-md;

		input {
			@apply py-2 px-3 rounded-md text-base bg-secondary border-[0.5px] border-gray-400 border-opacity-80 placeholder:text-slate-400 focus:outline-none text-white font-normal;
		}

		button {
			@apply bg-red-700 py-2 text-white rounded-md font-medium disabled:bg-red-400;
		}
	}
</style>
