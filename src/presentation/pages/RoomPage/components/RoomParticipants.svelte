<div id="participantArea" class="participant-area" />

<style lang="postcss">
	:global(.participant-area) {
		@apply overflow-hidden flex items-center justify-center flex-wrap content-center align-middle flex-1 rounded-md w-full h-full;
	}

	:global(.participant-area .participant) {
		@apply relative align-middle self-center rounded-md overflow-hidden inline-block shadow-lg h-full bg-secondary transition-all;
	}

	:global(.participant-area video) {
		@apply absolute z-10 right-0 object-cover bottom-0 w-full h-full bg-black rounded-md overflow-hidden left-0 top-0 bg-cover;
	}

	:global(.participant-area .participant .info-bar) {
		@apply absolute z-[12] bottom-3 left-4 text-white;
	}

	:global(.participant-area .participant .right) {
		@apply absolute z-[10] top-3 right-3 text-white;
	}

	:global(.participant-area .participant .right span) {
		@apply bg-white h-7 w-7 rounded-full flex justify-center items-center;
	}

	:global(.participant-area .participant .thums) {
		@apply w-full bg-secondary flex justify-center items-center h-full absolute left-0 top-0 z-[9] text-base uppercase;
	}

	:global(.participant-area .participant .thums img) {
		@apply h-4/5 sm:h-40 lg:h-44;
	}

	@media only screen and (max-width: 820px) {
		:global(.participant-area) {
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
			flex: 2;
		}
	}
</style>
