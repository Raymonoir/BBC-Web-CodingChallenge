

//Used to check if browser has gained access to connection
//window.addEventListener("offline", functiom (){})


let currentArticleImageArray = [];
var currentArticleSections = [];
let slideIndex = 0;
var currentArticlePos = 1;


window.addEventListener("offline", function ()
{
    console.log("There is no network connection");
} );


//Function to organise article sections and lay them out on the page
function setArticleHTML()
{
    //Sets the article title which is first in the array and then pop it from the front
    document.getElementById("articleParagraphs").innerHTML += "<h2> <u>" + currentArticleSections[0] +  " -  Article " + currentArticlePos+ "</u></h2><br>";
    currentArticleSections.shift();

    //Loop through all items in the article sections array
    for (let i = 0; i < currentArticleSections.length; i++)
    {
        //Sort each article section by its type and add it to the required section

        if (currentArticleSections[i].type === "heading")
        {
            document.getElementById("articleParagraphs").innerHTML += "<h3>" + currentArticleSections[i].model.text + "</h3><br>";
        }
        else if (currentArticleSections[i].type === "paragraph")
        {
            document.getElementById("articleParagraphs").innerHTML += currentArticleSections[i].model.text + " <br><br>";
        }
        else if (currentArticleSections[i].type === "list")
        {
            
            //Add any lists by looping through all items and then add prepared string to document
            var articleList = "<ul>";

            for (j = 0; j < currentArticleSections[i].model.items.length; j++ )
            {
                articleList += "<li>" + currentArticleSections[i].model.items[j] +  "</li>";
            }

            articleList += "</ul>";

            document.getElementById("articleParagraphs").innerHTML += articleList + "<br><br>";
        }


        if (currentArticlePos >= 5)
        {
            document.getElementById("nextArticleLink").href = "rating.html";
            document.getElementById("nextArticleLink").innerHTML = "Rate the articles";
            document.getElementById("nextArticleLink").onclick = "";
        }
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


//Function to sort through contents of article and display them in their alloted sections
function organiseArticleContents (articleJSON)
{
           //Loops through length of article body
           currentArticleSections.push(articleJSON.title);

            for (let i = 0; i < articleJSON.body.length; i++)
            { 
                //If its an image, add the url to the list of site images.
                if (articleJSON.body[i].type === "image")
                {
                    currentArticleImageArray.push(articleJSON.body[i].model.url + "?" + new Date().getTime());
                }
                //If the section type is anything but an image, add to article section array
                else
                {
                    currentArticleSections.push(articleJSON.body[i]);
                }

            }

            if (currentArticleImageArray.length != 0)
            {
                document.getElementById("articleSlides").style.display = "block";

                //Set the current image to first image in  array
                document.getElementById("articleImageID").src = currentArticleImageArray[0];

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
    if (slideIndex + slidePosChange > -1 && slideIndex + slidePosChange < currentArticleImageArray.length )
    {
        document.getElementById("articleImageID").src = currentArticleImageArray[slideIndex + slidePosChange] + "?" + new Date().getTime();
        slideIndex += slidePosChange; 
        document.getElementById("articleImageNumberID").innerHTML = (slideIndex + 1) + " / " + currentArticleImageArray.length;
    }
          
}

//Function to go to the next article
function getNextArticle ()
{
    //Only move if new article position is in 1-5
    if(currentArticlePos + 1 < 6)
    {
        clearArticleHTML();

        getArticleJSON(currentArticlePos+1).then(function()
            {
                setArticleHTML();
            }, 
            function(error)
            {
                console.log(error);
            });

        currentArticlePos +=1;
    }
}

//Function to go to previous article
function getPrevArticle()
{
    //Only move if new article position is in 1-5
    if(currentArticlePos-1 > 0)
    {
        clearArticleHTML();

        getArticleJSON(currentArticlePos-1).then(function()
        {
            setArticleHTML();
        }, 
        function(error)
        {
            console.log(error);

        });

        currentArticlePos -=1;
    }



}

//Function to reset and clear all variables which change per article
function clearArticleHTML()
{
    currentArticleImageArray = [];
    currentArticleSections = [];
    slideIndex = 0;
    document.getElementById("articleParagraphs").innerHTML = "";


}

//Function to get a single article in .JSON format which is returned in a promise
function getArticleJSON (articleNum)
{
    return new Promise(function(succeeded, failed)
    {

        let httpRequest = new XMLHttpRequest();
        httpRequest.responseType = "json";

        //The github url to the raw json files is supplied and concatenated with the given article number.
        httpRequest.open("GET", "https://raw.githubusercontent.com/bbc/news-coding-test-dataset/master/data/article-" + articleNum + ".json");

        //Called when the XMLHttpRequest has finished loading
        httpRequest.onloadend = () =>
        {
            //Operation is done && status == done (200)
            if (httpRequest.status === 200 && httpRequest.readyState === httpRequest.DONE)
            {
                let articleJSON = httpRequest.response;
                organiseArticleContents(articleJSON);
                succeeded();
            }
            else
            {
                failed(httpRequest.statusText);
            }
        }

        httpRequest.onerror = () =>
        {
            console.log("An error occurred with the get request")
        }

        httpRequest.send();

    });  

}

function getArticleRatings ()
{
    let ratingsArray = [];
    let articleID = "article";

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



function postArticleRatings (ratingsArray)
{
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


