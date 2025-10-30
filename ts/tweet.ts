class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if(this.text.toLowerCase().includes("completed") || this.text.includes("Just")) {
            return "completed_event"
        }
        if(this.text.toLowerCase().includes("live") || this.text.toLowerCase().includes("watch")) {
            return "live_event";
        }
        if(this.text.toLowerCase().includes("goal") || this.text.toLowerCase().includes("achieved") || this.text.toLowerCase().includes("set a")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if(this.source === 'completed_event' && this.text.includes("Check it out!")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const writtenTweets = [];
        if (this.written) { writtenTweets.push(this.text); }
        return writtenTweets.join("\n");
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const miIndex = this.text.indexOf(" mi ");
        const kmIndex = this.text.indexOf(" km ");
        const posted = this.text.indexOf("Just posted a ");

        let start = -1;
        if (miIndex !== -1) {
            start = miIndex + 4;
        }
        else if (kmIndex !== -1) {
            start = kmIndex + 4;
        } 
        else if (posted !== -1) {
            start = posted + 13;
        }
        else { 
            return "unknown"; 
        }

        const rest = this.text.slice(start).trim();
        const space = rest.indexOf(" ");
        const oneWord = space === -1 ? rest : rest.slice(0, space);

        return oneWord;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet
        const miRegex = /(\d+\.\d+) mi/;
        const miMatch = this.text.match(miRegex);
        const kmRegex = /(\d+\.\d+) km/;
        const kmMatch = this.text.match(kmRegex);

        if (miMatch) {
            return parseFloat(miMatch[1]);
        }
        if (kmMatch) {
            return parseFloat(kmMatch[1]) / 1.609;
        }
        
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const url = /https:\/\/t\.co\/\w+/;
        let tweet = this.text;

        if (url.test(tweet)) {
            tweet = tweet.replace(url, (match) => {
                return `<a href="${match}" target="_blank">${match}</a>`;
            });
        }
        let activity = "";
        if (this.source === 'completed_event') {
            activity = this.activityType;
        }
        
        return `<tr>
            <th scope="row">${rowNumber}</th>
            <td>${activity}</td>
            <td>${tweet}</td>
        </tr>`;
    }
}