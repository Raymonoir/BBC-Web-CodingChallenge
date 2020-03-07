



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
            console.log(articleJSON);
            

            //Loops through body of article and outputs paragraphs and images
            //Place holder for callback function later
            for (let i = 0; i < articleJSON.body.length; i++)
            {   
                if (articleJSON.body[i].type === "paragraph")
                {
                    document.getElementById("articleParagraphs").innerHTML += articleJSON.body[i].model.text;
                }
                else if (articleJSON.body[i].type === "image")
                {
                    //console.log(articleJSON)
                    document.getElementById("photos").innerHTML += "<img src = " + articleJSON.body[i].model.url + ">"
                }

            }
        }
    };


    
    httpRequest.send();

}




