let tweet_array = [];
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	writtenTweets = tweet_array.filter(tweet => tweet.source === 'completed_event' && tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBar = document.getElementById('textFilter');
	searchBar.addEventListener('input', function() {
		const input = searchBar.value.toLowerCase();
		const table = document.getElementById('tweetTable');

		if (input === '') {
			document.getElementById('searchText').innerText = '';
			document.getElementById('searchCount').innerText = 0;
			table.innerHTML = '';
			return;
		}
		document.getElementById('searchText').innerText = searchBar.value;
		const matching = writtenTweets.filter(tweet => tweet.text.toLowerCase().includes(input));
		document.getElementById('searchCount').innerText = matching.length;
		
		let content = '';
		matching.forEach((tweet, index) => {
			const row = tweet.getHTMLTableRow(index + 1);
			content += row;
		});
		table.innerHTML = content;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});