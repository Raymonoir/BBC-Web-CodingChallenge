

// let myOwnArticleImageArray = ['https://i.picsum.photos/id/502/640/420.jpg', 'https://i.picsum.photos/id/982/640/420.jpg', 'https://i.picsum.photos/id/358/640/420.jpg'];
let currentArticleImageArray = [];
let slideIndex = 0;


function organiseArticleContents (articleJSON)
{
            //Loops through body of article and outputs paragraphs and images
            //Place holder for callback function later
            for (let i = 0; i < articleJSON.body.length; i++)
            {   
                if (articleJSON.body[i].type === "paragraph")
                {
                    document.getElementById("articleParagraphs").innerHTML += articleJSON.body[i].model.text + " ";
                }
                else if (articleJSON.body[i].type === "image")
                {
                    currentArticleImageArray.push(articleJSON.body[i].model.url);
                }

            }

            document.getElementById("articleImageID").src = currentArticleImageArray[0];
            document.getElementById("articleImageNumberID").innerHTML = 1 + " / " + currentArticleImageArray.length;


            if (currentArticleImageArray.length == 0)
            {
                document.getElementById("articleSlides").remove();
            }
        }
        


function changeArticleImage(slidePosChange)
{
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




