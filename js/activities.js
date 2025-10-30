function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let validTweets = tweet_array.filter(tweet => tweet.source === 'completed_event' && tweet.activityType !== 'unknown' && tweet.distance > 0);

	const counts = {};
	for (const tweet of validTweets) counts[tweet.activityType] = (counts[tweet.activityType] || 0) + 1;
	document.getElementById('numberActivities').innerText = Object.keys(counts).length;

	const top3 = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
	document.getElementById('firstMost').innerText = top3[0];
	document.getElementById('secondMost').innerText = top3[1];
	document.getElementById('thirdMost').innerText = top3[2];

	const activityData = Object.entries(counts).map(([activity, count]) => ({activity, count}));
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": activityData},
	  //TODO: Add mark and encoding
	  "mark" : "bar",
	  "encoding": {
		"x": {"field": "count", "type": "quantitative", "title": "Number of Tweets"},
		"y": {"field": "activity", "type": "ordinal", "title": "Activity", "sort": "-x"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const rows = validTweets.filter(tweet => top3.includes(tweet.activityType))
		.map(tweet => ({activity: tweet.activityType, distance: tweet.distance, dayOfWeek: days[tweet.time.getDay()]})
		);

	const button = document.getElementById('aggregate');
	const visAll = document.getElementById('distanceVis');
	const visAgg = document.getElementById('distanceVisAggregated');
	let showingAggregated = false;
	visAll.style.display = 'block';
	visAgg.style.display = 'none';
	button.addEventListener('click', () => {
		showingAggregated = !showingAggregated;
		visAll.style.display = showingAggregated ? 'none' : 'block';
		visAgg.style.display = showingAggregated ? 'block' : 'none';
		button.textContent = showingAggregated ? 'Show all activities' : 'Show means';
	});

	const distanceVis = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distance of the top 3 tweeted activities each day of the week.",
		"data": {"values": rows},
		"mark": {"type": "point"},
		"encoding": {
			"x": {"field": "dayOfWeek", "type": "ordinal", "title": "time (day)", "sort": days},
			"y": {"field": "distance", "type": "quantitative", "title": "distance"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity"}
		}
	};
	vegaEmbed('#distanceVis', distanceVis, {actions:false});

	const distanceVisAggregated = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the mean distance of the top 3 tweeted activities each day of the week.",
		"data": {"values": rows},
		"mark": {"type": "point"},
		"encoding": {
			"x": {"field": "dayOfWeek", "type": "ordinal", "title": "time (day)", "sort": days},
			"y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean of distance"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity"}
		}
	};
	vegaEmbed('#distanceVisAggregated', distanceVisAggregated, {actions:false});

	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekend";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});