<script>
	import { onMount } from 'svelte';

	let topics = []
	let options = []

	onMount(async () => {
		const res = await fetch(`http://127.0.0.1:3030/topics`);
		topics = await res.json();
	});

	async function clickHandler() {
		const { innerText: topic } = this

		const res = await fetch(`http://127.0.0.1:3030/search?category=${topic}`);
		options = await res.json();
	}

	async function optionClickHandler() {
		console.log(this)
	}
</script>

<style>
	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
		margin-top: 60px;
	}

	.topics-list li {
		display: inline-block;
		width: 33%;
		font-size: 3em;
		border: 1px solid #EEE;
		padding: 22px 0px;
		text-align: center;
		opacity: .8;
	}

	.topics-list li:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	img {
		width: 100%;
		height: auto;
	}

	.options-list li {
		position: relative;
		margin: 24px 0;
	}

	.options-list div {
		position: absolute;
    bottom: 6px;
    width: 100%;
    height: 10%;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
		opacity: .7;
	}

	.options-list div:hover {
		text-decoration: underline;
		cursor: pointer;
		font-size: 2.1em;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Choose an option (topic):</h1>

<ul class="topics-list">
{#each topics as topic}
	<li on:click={clickHandler}>{topic[0]}</li>
{/each}
</ul>

<ul class="options-list">
	{#each options as option}
	<li on:click={optionClickHandler}>
		<img src={option.mediaUrl} alt="" />
		<div>I want this</div>
	</li>
	{/each}
</ul>
