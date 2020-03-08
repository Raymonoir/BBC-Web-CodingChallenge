

// let myOwnArticleImageArray = ['https://i.picsum.photos/id/502/640/420.jpg', 'https://i.picsum.photos/id/982/640/420.jpg', 'https://i.picsum.photos/id/358/640/420.jpg'];
let currentArticleImageArray = [];
let slideIndex = 0;

//Function to sort through contents of article and display them in their alloted sections
function organiseArticleContents (articleJSON)
{
           //Loops through length of article body
            for (let i = 0; i < articleJSON.body.length; i++)
            {   
                //If its a paragraph add to paragraph section
                if (articleJSON.body[i].type === "paragraph")
                {
                    document.getElementById("articleParagraphs").innerHTML += articleJSON.body[i].model.text + " ";
                }
                //If its an image, add the url to the list of site images.
                else if (articleJSON.body[i].type === "image")
                {
                    currentArticleImageArray.push(articleJSON.body[i].model.url);
                }

            }

            //Set the current image to first image in  array
            document.getElementById("articleImageID").src = currentArticleImageArray[0];

            //Set text at the top corner to 1/X
            document.getElementById("articleImageNumberID").innerHTML = 1 + " / " + currentArticleImageArray.length;

            //If there are no images on the page, remove the div of the article slides
            if (currentArticleImageArray.length == 0)
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




