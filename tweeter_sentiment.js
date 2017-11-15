'use strict';  //treat silly mistakes as run-time errors

//SENTIMENTS, EMOTIONS, and SAMPLE_TWEETS have already been "imported"


/*Below function Remove punctuation and single character words from user_text and then 
  return a list of words in lower case with length less than 1*/

function GetListOfWords(tweet) 
{
    tweet = tweet.toLowerCase();
    var splitedWords = tweet.split(/\W+/);
    return splitedWords.filter(IsLengthGreaterThanOne)
}

/* Below function checks the words whose length in greater than 1 */

function IsLengthGreaterThanOne(word)
{
    return word.length > 1;

}

/* Checks for the word entry in SENTIMENTS */

function CheckIfWordExistInSentiments(word)
{
    if(SENTIMENTS[word] != undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

/* Returns those words that have emotions */

function GetWordsWithEmotion(wordsArray)
{
    return wordsArray.filter(CheckIfWordExistInSentiments);
}

/* Create a dictionary where key is emotions and its value is the words which
    have this emotion  */

function GetWordsMappedWithEmotion(listOfWords)
{
    var wordsWithEmotion = GetWordsWithEmotion(listOfWords);

    // create an blank object
    var emotionWordObject = {};
    var emotionName;
    var i;
    for (i = 0; i < EMOTIONS.length; i++) 
    {
        emotionName = EMOTIONS[i];
        emotionWordObject[emotionName] = [];
    }

    var emotionalword;
    var emotionList;
    // Map words with emotion
    for(i = 0; i < wordsWithEmotion.length; i++)
    {
        emotionalword = wordsWithEmotion[i];
        emotionList = SENTIMENTS[emotionalword];

        for (var emotion in emotionList)
        {
            var wordList = emotionWordObject[emotion];
            wordList.push(emotionalword);
        }
    }

    return emotionWordObject;
}

/* Create a dictionary where key is emotions and its value is the hashtag which
    has this emotion */

function GetHashtagsMappedWithEmotion(listOfHastag, wordsMappedWithEmotion)
{
    // Create a blank object
    var emotionHashtagObject = {}
    var emotionName;
    var i;
    for (i = 0; i < EMOTIONS.length; i++) 
    {
        emotionName = EMOTIONS[i];
        emotionHashtagObject[emotionName] = [];
    }

    // If a emotion has a word then hashtag will get assosiated with that emotion
    for(var emotion in wordsMappedWithEmotion)
    {
        var wordList = wordsMappedWithEmotion[emotion];
        if(wordList.length > 0)
        {
            emotionHashtagObject[emotion] = listOfHastag;
        }
    }

    return emotionHashtagObject;
}

/* Function to Analyze the tweets. In line comments made within the function*/
function AnalyzeTweets(tweetsToAnalyze)
{
    var i;
    var tweet;
    for(i = 0; i < tweetsToAnalyze.length ; i++)
    {
         tweet = tweetsToAnalyze[i];
         
         // Get tweet text
         var tweetText = tweet["text"];

         // Get list of words from tweet text
         var listOfWord = GetListOfWords(tweetText)
         tweet["wordCount"] = listOfWord.length;

        // Get the dictionary which map emotion with words and store it in tweet dictionary
        var wordsMappedWithEmotion = GetWordsMappedWithEmotion(listOfWord)
        tweet["wordsMappedWithEmotion"] = wordsMappedWithEmotion;

        // get hashtag list
        var hashtagList = []
        var j;
        var allHashtag = tweet["entities"]["hashtags"];
        for(j = 0 ; j < allHashtag.length; j++)
        {
            hashtagList.push(allHashtag[j]["text"]);
        }

        // Get the dictionary which map emotion with hashtag and store it in tweet dictionary
        var hashtagsMappedWithEmotion = GetHashtagsMappedWithEmotion(hashtagList, wordsMappedWithEmotion)
        tweet["hashtagsMappedWithEmotion"] = hashtagsMappedWithEmotion;

    }

    // Data to print
    var analyzedData = {};
    var i;
    for (i = 0; i < EMOTIONS.length; i++) 
    {
        var emotionName = EMOTIONS[i];

        var totalWordsWithEmotion = [];
        var totalHashtagWithEmotion = [];
        var j;
        for(j = 0; j < tweetsToAnalyze.length ; j++)
        {
            var tweet = tweetsToAnalyze[j];

            // Get all the words and hashtag attached with emotion "emotionName"
            totalWordsWithEmotion = totalWordsWithEmotion.concat(tweet["wordsMappedWithEmotion"][emotionName]);
            totalHashtagWithEmotion = totalHashtagWithEmotion.concat(tweet["hashtagsMappedWithEmotion"][emotionName]);
        } 
        

        analyzedData[emotionName] = {}
        analyzedData[emotionName]["totalNumberOfWordsWithEmotion"] = totalWordsWithEmotion.length;
        analyzedData[emotionName]["sortedWord"] = SortWord(totalWordsWithEmotion)
        analyzedData[emotionName]["sortedHashtag"] = SortWord(totalHashtagWithEmotion)

    }

    return analyzedData;
}

function SortWord(wordList)
{
    // Sort each individual word in the wordList ordered by how many times it appears in that list.
    var wordCount = {};
    var i;
    var word;

    // Create frequency array
    for(i = 0 ; i < wordList.length ; i++)
    {
        word = wordList[i];
        if(wordCount[word] != undefined)
        {
            wordCount[word] = wordCount[word] + 1;
        }
        else
        {
            wordCount[word] = 1;
        }
    }

    // Create an array with unique element
    var uniqueWords = [];
    for(var word in wordCount)
    {
        uniqueWords.push(word);
    }

    return uniqueWords.sort(function(a,b){return wordCount[b] - wordCount[a]});
}

function GetTotalNumberOfWords(tweetToAnalyze)
{
    // Calculate and return total numbers of words in the given tweets
    var j;
    var totalNumberOfWords = 0;
    for(j = 0; j < tweetToAnalyze.length ; j++)
    {
        var tweet = tweetToAnalyze[j];
        totalNumberOfWords = totalNumberOfWords + tweet["wordCount"];
    }
    
    return totalNumberOfWords;
}

function ShowAnalyzedData(analyzedData, totatNumberOfWords)
{
    // Sort emotion in order to number of words
    var emotionArray = EMOTIONS;
    function CompareCountOfWord(a, b)
    {
        if(analyzedData[a]["totalNumberOfWordsWithEmotion"] != undefined)
        {
            if(analyzedData[b]["totalNumberOfWordsWithEmotion"] != undefined)
            {
                return analyzedData[b]["totalNumberOfWordsWithEmotion"] - analyzedData[a]["totalNumberOfWordsWithEmotion"];
            }
            else
            {
                return analyzedData[a]["totalNumberOfWordsWithEmotion"];
            }
        }
        else if(analyzedData[b]["totalNumberOfWordsWithEmotion"] != undefined)
        {
            return analyzedData[b]["totalNumberOfWordsWithEmotion"];
        }

        return 0;
    }

    emotionArray = emotionArray.sort(CompareCountOfWord)

    var table = d3.select("#emotionsTable");
    var emotionName;
    var row;
    var rowHTML;
    var i;
    for (i = 0; i < emotionArray.length; i++) 
    {
        emotionName = emotionArray[i];
        var percentage;
        if(totatNumberOfWords != 0)
        {
            percentage = (analyzedData[emotionName]["totalNumberOfWordsWithEmotion"] * 100) / totatNumberOfWords;
        }
        else
        {
            percentage = 0;
        }
        percentage = percentage.toFixed(2);
        var exampleWords = analyzedData[emotionName]["sortedWord"].slice(0,3).join(", ");
        
        var hashtagList = []
        var topThreeHashtag = analyzedData[emotionName]["sortedHashtag"].slice(0,3);
        var j;
        for( j = 0; j < topThreeHashtag.length ; j++)
        {
            hashtagList.push("#" + topThreeHashtag[j]);
        }

        var hashTagWords = hashtagList.join(", ");

        row = table.append("tr");
        rowHTML = `<td>` + emotionName + `</td>` + 
                  `<td>` +  percentage + `%</td>` +
                  `<td>` + exampleWords + `</td>` +
                  `<td>` + hashTagWords + `</td>`;
        row.html(rowHTML);
    }
}

function LoadTweetsAndThenAnalyzeAndShow(userName)
{
    // Get tweets to analyze for the user user_name
    if(userName == "SAMPLE")
    {
        // Analyze tweet
        var analyzedData = AnalyzeTweets(SAMPLE_TWEETS);
        var totalNumberOfWords = GetTotalNumberOfWords(SAMPLE_TWEETS);
    
       // Show analyzed data
       ShowAnalyzedData(analyzedData, totalNumberOfWords);
    }
    else
    {
        var requestUri = "https://faculty.washington.edu/joelross/proxy/twitter/timeline/?";
        var searcUri = requestUri + `screen_name=` + userName;
        d3.json(searcUri, function(data)
        {
            // Analyze tweet
            var analyzedData = AnalyzeTweets(data);
            var totalNumberOfWords = GetTotalNumberOfWords(data);
    
           // Show analyzed data
           ShowAnalyzedData(analyzedData, totalNumberOfWords);
        }); 
    }
}

function AnalyzeAndShowTweet()
{
    var table = d3.select("#emotionsTable");
    table.html(' ');
    
    var inputUserName = GetUserInput();

    // Get tweets on the basis of user name
    var tweetsToAnalyze = LoadTweetsAndThenAnalyzeAndShow(inputUserName);
}

function GetUserInput()
{
    var inputBox =  d3.select("#searchBox");
    return inputBox.property('value');
}


// Script start
var searchButton = d3.select("#searchButton")
searchButton.on('click', AnalyzeAndShowTweet);

// Show analysis for SAMPLE_TWEETS when page first loaded
// Analyze tweet
var analyzedData = AnalyzeTweets(SAMPLE_TWEETS);
var totalNumberOfWords = GetTotalNumberOfWords(SAMPLE_TWEETS);
    
// Show analyzed data
ShowAnalyzedData(analyzedData, totalNumberOfWords);




