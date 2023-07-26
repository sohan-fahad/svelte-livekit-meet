<script lang="ts">
	import RoomPage from '$src/presentation/pages/RoomPage/RoomPage.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<RoomPage token={data?.token} />
