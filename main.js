

//Used to check if browser has gained access to connection
//window.addEventListener("offline", functiom (){})


// let myOwnArticleImageArray = ['https://i.picsum.photos/id/502/640/420.jpg', 'https://i.picsum.photos/id/982/640/420.jpg', 'https://i.picsum.photos/id/358/640/420.jpg'];
let currentArticleImageArray = [];
let currentArticleSections = [];


let preLoadedArticles = [getArticleJSON(1)];


let slideIndex = 0;
let currentArticlePos = 1;



function preLoadSurroundingArticlesJSON(currentArticlePos)
{
    if (currentArticlePos === 1)
    {
        preLoadedArticles.push(getArticleJSON(2));
    }
    else if (currentArticlePos === 5)
    {
        preLoadedArticles.push(getArticleJSON(4));
    }
    else
    {
        preLoadedArticles.push(getArticleJSON(currentArticlePos-1));
        preLoadedArticles.push(getArticleJSON(currentArticlePos+1));
    }
}



function clearCurrentArticleHTML()
{
    //document.getElementById("articleText").innerHTML = "";
    //document.getElementById("articleImageID").src = "";

    currentArticleImageArray = [];
    currentArticleParagraphArray = [];

    slideIndex = 0;
    currentArticlePos = 1;
    preLoadedArticles = [];


}

//Section Types: Heading, Paragraph, Image (DONE), List 
//Function to organise article sections and lay them out on the page
function setArticleHTML()
{
    console.log("here")
    for (let i = 0; i < currentArticleSections.length; i++)
    {
        if (currentArticleSections[i].type = "heading")
        {
            document.getElementById("articleParagraphs").innerHTML += "<h3>" + currentArticleSections[i].model.text + "</h3>";
        }
        else if (currentArticleSections[i].type = "paragraph")
        {

            document.getElementById("articleParagraphs").innerHTML += currentArticleSections[i].model.text;
        }
        else if (currentArticleSections[i].type = "list")
        {

        }
    }

}


function changeArticleJSON (articlePosChange)
{
    //Change article if the new article if one of the 5
    if (currentArticlePos + articlePosChange > 0 && currentArticlePos + articlePosChange < 6)
    {
        currentArticlePos += articlePosChange;
        
        if (articlePosChange === -1)
        {
            //Get preloaded article which is previous to current article
            setArticleHTML(preLoadedArticles[0]);

        }
        else
        {
            //Get the preloaded article after current article
            setArticleHTML(preLoadedArticles[1]);
        }

    }

    preLoadSurroundingArticlesJSON(currentArticlePos)

}

//Function to sort through contents of article and display them in their alloted sections
function organiseArticleContents (articleJSON)
{
           //Loops through length of article body
            for (let i = 0; i < articleJSON.body.length; i++)
            {   
                //If its an image, add the url to the list of site images.
                if (articleJSON.body[i].type === "image")
                {
                    currentArticleImageArray.push(articleJSON.body[i].model.url);
                }
                //If the section type is anything but an image, add to article section array
                else
                {
                    currentArticleSections.push(articleJSON.body[i]);
                }

            }

            if (currentArticleImageArray.length != 0)
            {
                //Set the current image to first image in  array
                document.getElementById("articleImageID").src = currentArticleImageArray[0];

                //Set text at the top corner of image to 1/X
                document.getElementById("articleImageNumberID").innerHTML = 1 + " / " + currentArticleImageArray.length;

            }
            //If there are no images on the page, remove the div of the article slides
            else
            {
                document.getElementById("articleSlides").remove();
            }
        }


        

//This function is given a position change eg. (1, -1), supplied by the movement buttons on the image 
function changeArticleImage(slidePosChange)
{   
    //As long as the new position is in range of the image array, change the image src.
    if (slideIndex + slidePosChange > -1 && slideIndex + slidePosChange < currentArticleImageArray.length )
    {
        document.getElementById("articleImageID").src = currentArticleImageArray[slideIndex + slidePosChange];
        slideIndex += slidePosChange; 
        document.getElementById("articleImageNumberID").innerHTML = (slideIndex + 1) + " / " + currentArticleImageArray.length;
    }
          
}

//Function to get a single article in .JSON format
function getArticleJSON (articleNum)
{
    let httpRequest = new XMLHttpRequest();
    httpRequest.responseType = "json";

    //The github url to the raw json files is supplied and concatenated with the given article number.
    httpRequest.open("GET", "https://raw.githubusercontent.com/bbc/news-coding-test-dataset/master/data/article-" + articleNum + ".json");

    //Called when the state of the XMLHttpRequest changes state 
    httpRequest.onreadystatechange = () =>
    {
        //Operation is done && status == done (200)
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200)
        {
            articleJSON = httpRequest.response;
            organiseArticleContents(articleJSON);
        }
    };

    httpRequest.send();

}




