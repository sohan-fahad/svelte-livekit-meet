<script>
	let index = 1;
	let dropdownRef;
	let isActive = false;

	const toggle = () => {
		isActive = !isActive;
	};
</script>

<div class="select">
	<button class="selectBtn" data-type="firstOption" on:click={toggle}>First option</button>
	<div class="selectDropdown" class:toggle={isActive} bind:this={dropdownRef}>
		<button class="option" on:click={toggle} data-type="firstOption">First option</button>
		<button class="option" on:click={toggle} data-type="secondOption">Second option</button>
		<button class="option" on:click={toggle} data-type="thirdOption">Third option</button>
	</div>
</div>

<style>
	.select {
		position: relative;
		margin-bottom: 15px;
		width: 250px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
	.select .selectBtn {
		background: var(--bg1);
		padding: 10px;
		box-sizing: border-box;
		border-radius: 3px;
		width: 100%;
		cursor: pointer;
		position: relative;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		background: #fff;
	}
	.select .selectBtn:after {
		content: '';
		position: absolute;
		top: 45%;
		right: 15px;
		width: 6px;
		height: 6px;
		-webkit-transform: translateY(-50%) rotate(45deg);
		transform: translateY(-50%) rotate(45deg);
		border-right: 2px solid #666;
		border-bottom: 2px solid #666;
		transition: 0.2s ease;
	}
	.select .selectBtn.toggle {
		border-radius: 3px 3px 0 0;
	}
	.select .selectBtn.toggle:after {
		-webkit-transform: translateY(-50%) rotate(-135deg);
		transform: translateY(-50%) rotate(-135deg);
	}
	.select .selectDropdown {
		position: absolute;
		bottom: 100%;
		width: 100%;
		border-radius: 0 0 3px 3px;
		overflow: hidden;
		background: var(--bg1);
		border-top: 1px solid #eee;
		z-index: 1;
		background: #fff;
		-webkit-transform: scale(0, 0);
		transform: scale(0, 0);
		-webkit-transform-origin: top center;
		transform-origin: top center;
		visibility: hidden;
		transition: 0.2s ease-in;
		box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
	}
	.select .selectDropdown .option {
		padding: 10px;
		box-sizing: border-box;
		cursor: pointer;
	}
	.select .selectDropdown .option:hover {
		background: #f8f8f8;
	}
	.select .selectDropdown.toggle {
		visibility: visible;
		-webkit-transform: scale(1, 1);
		transform: scale(1, 1);
	}
</style>
