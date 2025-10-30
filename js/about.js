function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	
	// find the earliest and latest date
	let dates = tweet_array.map(t => t.time);
	let earliest = new Date(Math.min(...dates));
	let latest = new Date(Math.max(...dates));
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString();
	document.getElementById('lastDate').innerText = latest.toLocaleDateString();

	// categorize the tweets
	let completedAmt = 0;
	let liveAmt = 0;
	let achievementAmt = 0;
	let miscellaneousAmt = 0;
	const totalAmt = tweet_array.length;

	for (let tweet of tweet_array) {
		let source = tweet.source;
		if (source === 'completed_event') completedAmt++;
		if (source === 'live_event') liveAmt++;
		if (source === 'achievement') achievementAmt++;
		if (source === 'miscellaneous') miscellaneousAmt++;
	}
	document.querySelectorAll('.completedEvents').forEach(element => element.innerText = completedAmt);
	document.querySelector('.liveEvents').innerText = liveAmt;
	document.querySelector('.achievements').innerText = achievementAmt;
	document.querySelector('.miscellaneous').innerText = miscellaneousAmt;

	document.querySelector('.completedEventsPct').innerText = ((completedAmt / totalAmt) * 100).toFixed(2) + '%';
	document.querySelector('.liveEventsPct').innerText = ((liveAmt / totalAmt) * 100).toFixed(2) + '%';
	document.querySelector('.achievementsPct').innerText = ((achievementAmt / totalAmt) * 100).toFixed(2) + '%';
	document.querySelector('.miscellaneousPct').innerText = ((miscellaneousAmt / totalAmt) * 100).toFixed(2) + '%';

	// count the number of written tweets
	let writtenAmt = 0;
	for (let tweet of tweet_array) {
		if (tweet.written) {
			writtenAmt++;
		}
	}
	document.querySelector('.written').innerText = writtenAmt;
	document.querySelector('.writtenPct').innerText = ((writtenAmt / completedAmt) * 100).toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});