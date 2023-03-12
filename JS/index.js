gapi.load("client", loadClient);
var pageToken = '';
document.querySelector("#search").addEventListener("click",(e)=>{
    const userInput = document.querySelector("#user_input").value;
    console.log(userInput)
    // e.preventDefault()
    document.querySelector("#user_input").value="";
    execute(userInput);
})
function loadClient() {
    gapi.client.setApiKey("AIzaSyAB5h6vk3xw2t7y91atL-xQqBFnqA5PoEU");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}
function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    // execute();
}
function execute(userInput="youtube") {
    const searchString = userInput;
    const maxresult = 10;
    const orderby = "viewCount";
  
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": orderby,
        "maxResults": maxresult,
        "q": searchString
    };
  
    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }
  
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        const listItems = response.result.items;
        console.log(listItems)
        if (listItems) {
            let output = '<h4>Videos</h4><ul>';
  
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                output += `
                    <li><a data-fancybox href="https://www.youtube.com/watch?v=${videoId}"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a><p>${videoTitle}</p></li>
                `;
            });
            output += '</ul>';
  
            if (response.result.prevPageToken) {
                output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
            }
  
            if (response.result.nextPageToken) {
                output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
            }
  
            // Output list
            videoList.innerHTML = output;
        }
    },
    function(err) { console.error("Execute error", err); });
}
