# raymonoir.github.io
BBC WebApp

<h1><u> My experience with this task </u></h1>

I understand this section was not required of me however I wanted to summarise and discuss my experience with this problem. I decided to face this problem by using HTTP requests directly to the raw JSON files supplied within the data folder of the git repository (https://github.com/bbc/news-coding-test-dataset/tree/master/data).
 

<h2><u> My difficulties</u> </h2>

When first faced with this challenge I was unsure of my ability to complete a web development challenge as I am not primarily a web developer. However, when I read the specification of the problem and realised it was largely JavaScript based my confidence increased. 

When starting this problem, I tried breaking the JavaScript side down into objects however I believed doing this had no advantage over a more procedural paradigm, so I was more out of my comfort zone not using an object orientated approach. 


<h2> <u>Sections I could approve upon</u></h2>
 
My plan for testing was to use QUnit which is a JavaScript testing framework, very similar to JUnit for java. This way I would be able to create unit tests for my news reader. I found when beginning my testing units, I would be required to refactor a lot of my procedures to make them more 'testable'. This is why I decided I did not have enough time to implement all the tests I would have liked. I have created a testing HTML and JavaScript file with the code I would have used commented out.

I also realise my CSS styling may not be perfectly scalable for larger projects with multiple HTML pages, this is due to the fact I do not have an extremely in-depth knowledge of CSS styling and how these are used within a larger document. I have tested the usability of my site on different devices and it is well formatted however it is not perfectly optimised. 

<h2><u>How I solved some of the issues I faced</u></h2>

When scanning through the articles I saw there are multiple different sections as well as varying number of sections. I decided to split these sections into two separate groups: images and everything else. This way I was able to handle the text-based sections separately from the images. I then looped through the text-based sections which were previously pushed into an array and add them to the text body.

I also found many articles had varying number of images, I first thought of fixing this by creating separate image elements however I could not think of a way to layout the article with different number of images, I then decided to change the method of handling images by placing them in a 'slideshow' which is navigated by buttons, this way all images are in the same position and I can just remove the image totally if the article does not include images.

When I was working on changing articles and moving through images, I found that, due to the way Lorem Picsum works, using the random image link I was provided in the articles would mean when scrolling though images and changing articles the image would always be the same. I wanted different images, so I added a small timestamp to each link, this way every time a new image is loaded, a different image appears. This does mean however different images appear when scrolling forwards and back in the same image slideshow.

Whilst working on implementing the ability to scroll through multiple articles I ran into the issue that I was attempting to set the HTML of the article before the asynchronous HTTP GET request to retrieve the article had complete. I took two actions to solve this: I began by changing the method I used to call the call-back function from onreadystatechange to onloadend, this means the function is only called when the request has totally finished. I also changed my method to get the article JSON, so it returns a promise, this way I am able to better control the asynchronous logic as well as deal with errors.

During the later portion of the task I was required to make a HTTP POST request for the ratings of the articles. As I did not have a URL to send this POST request, I had to stub this request, I done this by simply console logging the data that would have been sent. I have also left the code I would have used to make the POST request commented out. 

When I completed my base solution, I decided to implement a solution to preloading the articles before they are viewed by the user. I have done this by creating an array of preloaded articles, this is filled with the articles that surround the current article being viewed. The surrounding articles are retrieved when a user chooses to navigate to either the next or previous articles. This way the user only has to wait for an article's http request to complete when first loading the window.
