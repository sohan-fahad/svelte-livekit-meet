<div id="screeanShareArea" class="screen-share-area" />

<style lang="postcss">
	:global(.screen-share-area) {
		@apply rounded-md overflow-hidden hidden justify-center items-center w-full h-full;
		flex: 2;
	}

	:global(.screen-share-area .participant) {
		@apply relative align-middle rounded-md overflow-hidden inline-block shadow-md bg-secondary h-full w-full transition-all;
	}

	:global(.screen-share-area .participant video) {
		@apply absolute z-10 right-0 object-contain bottom-0 w-full h-full bg-black rounded-md overflow-hidden left-0 top-0 bg-cover;
	}

	:global(.screen-share-area .participant .info-bar) {
		@apply absolute z-[12] bottom-3 left-4 text-white;
	}

	:global(.screen-share-area .participant .right) {
		@apply absolute z-[10] top-3 right-3 text-white;
	}
</style>
