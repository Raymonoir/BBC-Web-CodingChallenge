
/*
@Author: Raymond Ward

This javascript file adds functionality to my Ray's News Reader html page.

*/

let currentArticleImageArray = [];
let currentArticleSectionsArray = [];
let preloadedArticles = [];
let imageSlideIndex = 0;
let currentArticleIndex = 1;

//Event listener for when the window is offline.
window.addEventListener("offline", function ()
{
    console.log("There is no network connection");
} );


//Function to organise article sections and lay them out on the page
function setArticleHTML()
{
    //Sets the article title which is first in the array and then pop it from the front
    document.getElementById("articleContent").innerHTML += "<h2> <u>" + currentArticleSectionsArray[0] +  " -  Article " + currentArticleIndex+ "</u></h2><br>";
    currentArticleSectionsArray.shift();

    //Loop through all items in the article sections array
    for (let i = 0; i < currentArticleSectionsArray.length; i++)
    {
        //Sort each article section by its type and add it to the required section
        if (currentArticleSectionsArray[i].type === "heading")
        {
            document.getElementById("articleContent").innerHTML += "<h3>" + currentArticleSectionsArray[i].model.text + "</h3><br>";
        }
        else if (currentArticleSectionsArray[i].type === "paragraph")
        {
            document.getElementById("articleContent").innerHTML += currentArticleSectionsArray[i].model.text + " <br><br>";
        }
        else if (currentArticleSectionsArray[i].type === "list")
        {
            //Add any lists by looping through all items and then add prepared string to document
            let articleList = "<ul>";

            for (j = 0; j < currentArticleSectionsArray[i].model.items.length; j++ )
            {
                articleList += "<li>" + currentArticleSectionsArray[i].model.items[j] +  "</li>";
            }

            articleList += "</ul>";

            document.getElementById("articleContent").innerHTML += articleList + "<br><br>";
        }

        //If the current article is the last article, show the button which leads to rating articles
        if (currentArticleIndex >= 5)
        {
            document.getElementById("nextArticleLink").innerHTML = "Rate the articles";
            document.getElementById("nextArticleLink").onclick = () =>
            {
                goToRatingsPage();
            };

        }
        //If not last article, show next article button
        else
        {
            document.getElementById("nextArticleLink").innerHTML = "Next Article";
            document.getElementById("nextArticleLink").removeAttribute("href");
            document.getElementById("nextArticleLink").onclick = () =>
            {
                getNextArticle();
            };
        }
    }

}


function goToRatingsPage()
{
    document.getElementById("nextArticleLink").href = "rating.html";
}

//Function to sort through contents of article and display them in their alloted sections
function organiseArticleContents (articleJSON)
{
           currentArticleSectionsArray.push(articleJSON.title);

            //Loops through length of article body
            for (let i = 0; i < articleJSON.body.length; i++)
            { 
                //If its an image, add json object to the list of site images.
                if (articleJSON.body[i].type === "image")
                {
                    currentArticleImageArray.push(articleJSON.body[i]);
                }
                //If the section type is anything but an image, add to article section array
                else
                {
                    currentArticleSectionsArray.push(articleJSON.body[i]);
                }
            }

            if (currentArticleImageArray.length != 0)
            {
                document.getElementById("articleSlides").style.display = "block";

                //Set the current image to first image in  array
                document.getElementById("articleImageID").src = currentArticleImageArray[0].model.url + "?" + new Date().getTime();
                document.getElementById("articleImageID").alt = currentArticleImageArray[0].model.altText;

                //Set text at the top corner of image to 1/X
                document.getElementById("articleImageNumberID").innerHTML = 1 + " / " + currentArticleImageArray.length;

            }
            //If there are no images on the page, remove the div of the article slides
            else
            {
                document.getElementById("articleSlides").style.display = "none";
            }

        
}
   

//This function is given a position change eg. (1, -1), supplied by the movement buttons on the image 
function changeArticleImage(slidePosChange)
{   
    //As long as the new position is in range of the image array, change the image src.
    if (imageSlideIndex + slidePosChange > -1 && imageSlideIndex + slidePosChange < currentArticleImageArray.length )
    {
        document.getElementById("articleImageID").src = currentArticleImageArray[imageSlideIndex + slidePosChange].model.url + "?" + new Date().getTime();
        document.getElementById("articleImageID").alt = currentArticleImageArray[imageSlideIndex + slidePosChange].model.altText;
        imageSlideIndex += slidePosChange; 
        document.getElementById("articleImageNumberID").innerHTML = (imageSlideIndex + 1) + " / " + currentArticleImageArray.length;
    }
}

//Function to go to the next article
function getNextArticle ()
{
    //Only move if new article position is in 1-5
    if(currentArticleIndex + 1 < 6)
    {
        resetArticle();

        currentArticleIndex +=1;

        prepareArticleJSON(preloadedArticles[0]);

        preloadedArticles = [];

        preloadArticles();

        console.log("forward V");
        console.log(preloadedArticles);
    }

}

//Function to go to previous article
function getPrevArticle()
{
    //Only move if new article position is in 1-5
    if(currentArticleIndex-1 > 0)
    {
        resetArticle();

        currentArticleIndex -=1;

        prepareArticleJSON(preloadedArticles[1]);

        preloadedArticles = [];

        preloadArticles();

        console.log("backward V");
        console.log(preloadedArticles);
    }

}

//Function to reset all variables and clear page HTML.
function resetArticle()
{
    currentArticleImageArray = [];
    currentArticleSectionsArray = [];
    imageSlideIndex = 0;
    document.getElementById("articleContent").innerHTML = "";
}

//Function to get a single article in .JSON format which is returned in a promise
function getArticleJSON (articleNum)
{
    //Returns a promise to provide the articleJSON
    return new Promise(function(succeeded, failed)
    {
        let httpRequest = new XMLHttpRequest();
        httpRequest.responseType = "json";

        //The github url to the raw json files is supplied and concatenated with the given article number.
        httpRequest.open("GET", "https://raw.githubusercontent.com/bbc/news-coding-test-dataset/master/data/article-" + articleNum + ".json");

        //Called when the XMLHttpRequest has finished loading
        httpRequest.onloadend = () =>
        {

            if (httpRequest.status === 404)
            {
                console.log("Article Not Found");
            }

            //Operation is done && status == done (200)
            if (httpRequest.status === 200 && httpRequest.readyState === httpRequest.DONE)
            {
                let articleJSON = httpRequest.response;
                succeeded(articleJSON);
            }
            else
            {
                failed(httpRequest.statusText);
            }
        }

        //Event listener for any error that occurs with the httpRequest
        httpRequest.onerror = () =>
        {
            console.log("An error occurred with the get request")
        }

        httpRequest.send();

    });  

}


function prepareArticleJSON(articleJSON)
{
    organiseArticleContents(articleJSON);
    setArticleHTML();
}


//This function retrieves the ratings given to the articles by the user
function getArticleRatings ()
{
    let ratingsArray = [];
    let articleID = "article";

    //Loops through and gets each element by id and adds rating to array.
    for (let i = 1; i < 6; i++)
    {
        let rating = document.getElementById(articleID + i).value;
        ratingsArray.push(rating);
    }


    postArticleRatings(ratingsArray).then(function ()
    {
        alert("Ratings posted");
    },
    function (e)
    {
        console.log(e);
    });

}


//Function to make a http POST request to post the article ratings  
function postArticleRatings (ratingsArray)
{
    //Returns a promise to POST the articles ratings
    return new Promise(function(succeeded, failed)
    {
        /*
        let httpRequest = new XMLHttpRequest();

        httpRequest.open("POST", "example.com", true);

        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.setRequestHeader("Accept", "application/json");


        httpRequest.send(data);
        */

        try 
        {
            var data = JSON.stringify({"article1": ratingsArray[0], "article2": ratingsArray[1],"article3": ratingsArray[2],"article4": ratingsArray[3],"article5": ratingsArray[4]});
            console.log(data);
            succeeded();
        }
        catch (e)
        {
            failed(e);
        }

    }); 


}


/*

How I would go about preloading surrounding articles:
1.  When moving from one article to another I would make a http request to GET the surrounding articles
    eg if the user is on article 2 I would get article 1 & 3. 

2.  I would then add these JSON files to an array and when the user requested either of the pages I would use 
    one of the two articles to set the page HTML.

3. This way a user can only navigate to an article that has already been preloaded.

*/


function preloadArticles ()
{
    if (currentArticleIndex === 1)
    {
       getArticleJSON(2).then(function (articleJSON)
       {
            preloadedArticles[0] = articleJSON;
       },
       function ()
       {

       });
    }
    else if (currentArticleIndex === 5)
    {
       getArticleJSON(4).then(function (articleJSON)
       {
            preloadedArticles[1] = articleJSON;
       },
       function ()
       {
           
       });
    }
    else 
    {
        getArticleJSON(currentArticleIndex + 1).then(function (articleJSON)
       {
            preloadedArticles[0] = articleJSON;
       },
       function ()
       {
           
       })
       .then(getArticleJSON(currentArticleIndex - 1).then(function (articleJSON)
       {
            preloadedArticles[1] = articleJSON;
       },
       function ()
       {
           
       }));
        
    }
}






