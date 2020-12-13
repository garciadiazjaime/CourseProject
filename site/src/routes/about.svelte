<svelte:head>
	<title>About</title>
</svelte:head>

<h1>Chicago Food Finder</h1>

<p>
	The goal is to provide food options for the Chicago Area.
</p>

<p>
	How this works?
</p>

<ul>
	<li>
		<h2>Cron</h2>
		<p>
			Cron runs every hour to pull latest posts from Instagram API using a hashtag: <a href="https://www.instagram.com/explore/tags/chicagofood/" target="_blank">#chicagofood.</a>
			Hosted in Heroku.
		</p>
	</li>
	<li>
		<h2>Database</h2>
		<p>
			Posts are saved in a Mongo Database hosted in <a href="https://cloud.mongodb.com/" target="_blank">Atlas</a>, which is a Cloud Provider.
		</p>
	</li>
	<li>
		<h2>API</h2>
		<p>
			A nodejs restful api hosted in <a href="https://chicago-food-20.herokuapp.com/" target="_blank">Heroku</a>, exposes the following endpoints:
		</p>
		<ul>
			<li>
				<h3><a href="https://chicago-food-20.herokuapp.com/topics" target="_blank">/topics</a></h3>
				<p>
					This endpoint analyses the <b>latest 500 posts</b> and with the help of <b><a href="https://github.com/garciadiazjaime/CourseProject/blob/main/lda/lib.js#L119" target="_blank">LDA</a></b> extracts the <b>most trending topics</b> found on the caption of the posts.
				</p>
				<p>
					It also cleans the data by <a href="https://github.com/garciadiazjaime/CourseProject/blob/main/lda/stopwords_en.js" target="_blank">removing certain words</a>.
				</p>
			</li>
			<li>
				<h3><a href="https://chicago-food-20.herokuapp.com/search?category=pizza" target="_blank">/search</a></h3>
				<p>
					Receives a category (topic) as a query parameter and returns posts that include that topic.
				</p>
			</li>
			<li>
				<h3>/choice</h3>
				<p>
					Saves the relation: <b>Topic - Post</b> chosen by the user when they click a post. In a <b>future interation</b> this will help to improve the /search endpoint.
				</p>
			</li>
		</ul>
	</li>
	<li>
		<h2>Web app</h2>
		<p>
			This web app was built with <a href="https://sapper.svelte.dev/" target="_blank">sapper</a> and it's hosted in <a href="https://www.netlify.com/" target="_blank">Netlify</a>, shows mainly three actions:
		</p>

		<ul>
			<li>
				<h2>Topics</h2>
				<p>
					Pulling the data from the API.
				</p>
			</li>
			<li>
				<h2>Options</h2>
				<p>
					Based on the Topic chosen by the user, the app hits the API to pull options for that topic.
				</p>
			</li>
			<li>
				<h3>Choice</h3>
				<p>
					Finally when the user clicks a post, is taken to the original publication in Instagram and at the same time the selections is saved, in a future iteration this will help to improve the search algorithm.
				</p>	
			</li>
		</ul>
	</li>
</ul>

<br />

<p>
This is pretty much it, so in a few words:
</p>
<b><i>
This is a tool that pulls Chicago Food posts from Instagram and using LDA Topic Modeling extracts the most trending topics,
which then are cleaned to show only food related topics, and show to you throught a web app.
</i></b>
<p>
Thanks for reading, this was fun for me, I hope it was for you too.
</p>
<p>
If you have any question, comment, complaint, joke, job offer please send me a tweet: <a href="https://twitter.com/jaumint" target="_blank">@jaumint</a>
</p>
