<script>
	export let message = '';
</script>

<div
	class="flex flex-col items-center justify-center h-full w-full fixed left-0 top-0 z-30 bg-[#00000080]"
>
	<div class="spinner" />
	<p class="text-white mt-3">{message}</p>
</div>

<style>
	.spinner {
		@apply block w-10 h-10 border-4 border-gray-400 border-t-white rounded-full;
		animation: rotation 1s infinite linear;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(359deg);
		}
	}
</style>
