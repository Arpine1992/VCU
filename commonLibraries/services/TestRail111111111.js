name: Run jenkins jobe
description: Shows a 'Hello, world!' message on the dashboard
author: Gurock Software
version: 1.0
includes: ^runs
excludes: 

js:
$(document).ready(function () {
    var customButton = $('<button>', {
        text: 'Run Jenkins Job',
        click: function () {
            alert('Button Clicked!');

            const jenkinsUrl = 'https://five-dryers-hug.loca.lt/job/CloneGitHubAndRun/build';
            console.log(jenkinsUrl + "jenkinsURL***********************************")
	        const userName = 'arpine';  // Jenkins username
            const apiToken = '11b6b502dc6f395aaabced4201b02d0fa7';  // Jenkins API token

            const authHeader = 'Basic ' + btoa(`${userName}:${apiToken}`);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                },
                body: JSON.stringify({})
            };
            console.log(requestOptions + "requestOPT:((((((((((((((((((((((((((((((((((((((((((((")
            fetch(jenkinsUrl, requestOptions)
                .then(response => {
                    if (response.ok) {
                        console.log('Build triggered successfully');
                        // Add additional logic or messages if needed
                    } else {
                        throw new Error(`Error triggering build: ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('Error triggering build:', error.message);
                });
        }
    });

    // Append the button to a specific element on the page
    $('#sidebar').append(customButton);
});