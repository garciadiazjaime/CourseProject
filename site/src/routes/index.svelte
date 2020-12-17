<script>
	import { onMount } from 'svelte';
	import Lazy from 'svelte-lazy';

	let topics = []
	let options = []
	let showOptions = false
	let selectedTopic = ''

	onMount(async () => {
		const res = await fetch(`process.API_URL/topics`);
		topics = await res.json();
	});

	async function clickHandler() {
		showOptions = true
		options = []

		const { innerText: topic } = this
		selectedTopic = topic
		document.getElementById('options').scrollIntoView();

		const res = await fetch(`process.API_URL/search?category=${topic}`);
		options = await res.json();
	}

	async function optionClickHandler() {
		const permalink = this.attributes['data-url'].value
		const id = this.attributes['data-id'].value

		window.open(permalink)
		
		await fetch(`process.API_URL/choice`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, topic: selectedTopic })
		});	
	}
</script>

<style>
	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
		margin-top: 20px;
	}

	.topics-list li {
		display: inline-block;
		width: 33%;
		font-size: 3em;
		border: 1px solid #EEE;
		padding: 16px 0px;
		text-align: center;
		opacity: .8;
	}

	@media (max-width: 640px) {
		.topics-list li {
			width: 100%;
		}
	}

	.topics-list li:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.selected {
		color: rgb(255,62,0);;
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
    height: 25%;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
		opacity: .6;
	}

	.options-list div:hover {
		text-decoration: underline;
		cursor: pointer;
		font-size: 2.1em;
	}


	.loader {
		border: 16px solid #f3f3f3; /* Light grey */
		border-top: 16px solid #3498db; /* Blue */
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.container .loader {
		margin: 0 auto;
	}

	.container p {
		text-align: center;
		margin: 24px;
		font-size: 2em;
	}
</style>

<svelte:head>
	<title>#feedmechicago | Chicago food options based on what Instragram users are posting.</title>
	<meta content="Chicago food options based on what users are posting on Instagram" property="og:description">
</svelte:head>

<h1>
	What to eat in Chicago?
</h1>
<p>
	#feedmechicago collects and analyzes data from Instagram posts about Chicago Food in the hope to help you find something delicious to eat in beautiful Chitown.
</p>

{#if topics.length }
<h1>Food Options:</h1>
<ul class="topics-list">
	{#each topics as topic}
	<li on:click={clickHandler} class:selected={selectedTopic === topic[0]}>{topic[0]}</li>
	{/each}
</ul>
{:else}
<div class="container">
	<div class="loader"></div>
	<p>
		Hold on, let me get you the trending options (topics)...
	</p>
</div>
{/if}

<div id="options">
	{#if options.length }
	<ul class="options-list">
		{#each options as option}
		<li>
			<Lazy height={300}>
				<img src={option.mediaUrl} alt="" />
			</Lazy>
			<div on:click={optionClickHandler} data-url={option.permalink} data-id={option.id}>See more</div>
		</li>
		{/each}
	</ul>
	{:else if showOptions}
	<div class="container">
		<div class="loader"></div>
		<p>
			Hold on, let me get you the best options...
		</p>
	</div>
	{/if}
</div>

<p>
	Our food options for Chicago change frequently based on what posts on Instagram are about.
</p>
