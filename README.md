<h1>Hack Or Snooze</h1>

  ````diff
@@ https://shaylee1107.github.io/Hack-or-Snooze/ @@
````


<img width="1440" alt="image" src="https://github.com/user-attachments/assets/02dbbc1a-1a6b-4d0c-9254-1a40a4c31677">



<h2>Description:</h2>
<p>Hack Or Snooze is a social news website--based off Hacker News--programmed with JavaScript/jQuery using the Hack Or Snooze API. Users can keep updated with the latest news in tech, and add their own resources as well as favorite stories/resources.</p>

<h2>Features:</h2>
<ul>
  <li>Login/Sign-up: prompts users to login or create an account to veiw/save their data.</li>
  <li>Navbar: gives users easy access to the Home, Story-submit, Favorites, and My Stories tabs.</li>
  <li>Story Submit: allows users to share any resouces to Hacker Or Snooze.</li>
  <li>Favorites: users may favorite a resource by clicking the star icon and veiw/manage them.</li>
  <li>My Stories: after submitting a story, they can all be veiwed and removed.</li>
</ul>

<h2>User Flow:</h2>
<p>When first opening the Hack Or Snooze website, the Hack or Snooze API fetches and displays a list of stories/resources. Each resource shows the number of the order the story is placed on the list, star icon (meant to be the way to favorite a resource), title, url to veiw the resource at, creator of the resource, and the username of who added it to Hack or Snooze. If the user clicks the tan star icon while not being signed in, the star will change to being grey. The story will only have that grey star as long as the session/window is active, as there is no account to remember the story was favorited. If the user clicks the now grey star icon, it will turn back to tan.</p>

<p>The navbar will only display the "Hack or Snooze" (directs to the home page of resources), and "login/signup" options until the user creates an account or logs in. To login or sign up the user must click "login/signup" and submit the correct form for the action they need: "Login" to open their existing account, or "Create Account" to make a new account. Once either form is filled out the user must hit the submit button--the "Login" form's submit button says "login", and the "Create Account" form's submit button says "create account". The "Login" form will only accept the correct username and password to an existing account, while the "Create Account" will only accept a username that another user has not already used (the username and password may be the same as another user).</p>  

<p>Once the user has logged in or created an account the navbar adds more options: "Submit", "Favorites", "My Stories", and "(logout)".</p> 
<ul>
  <li>Submit: The "Submit" allows a user to share a resource they want others to see. This tab will pop open and be available while also within any of the other tabs. The "Submit" accepts an "Author": which should be the author of the resource, "Title": being the title of the resource, and "Url": which is the url location to open the resource. This submit form will only be submitted as long as the url provided is an actual url. Once the "Submit" button is pressed the resource is added to Hack Or Snooze.</li>
  <li>Favorites: the "Favorites" takes the user to a tab with all of their resources they've favorited from previously clicking the tan star icon on resources from the "Hack or Snooze" home tab. When the user clicks the tan star icon it will turn grey, as well as add a clone of that resource to the "Favorites" tab. The user may click the grey star icon in this tab to remove the resource from their favorites.</li>
  <li>My Stories: the "My Stories" tab will show the user all of the resources they have shared to Hack or Snooze. They also have the ability to remove any of their contributed resources by clicking the trash-can icon. This icon will appear grey until hovered over, making it turn red. When this button is clicked, the story is removed from both the "My Stories" tab and the Hack or Snooze website.</li>
  <li>"(logout)": This button will log the user out of their account, returning them to the home tab with the navbar added options removed, and only the "Hack or Snooze" home and "login/signup" options visiable.</li>
</ul>

<h2>Hack or Snooze API</h2>

  ````diff
@@ https://hackorsnoozev3.docs.apiary.io/# @@
````

<p>To use the Hack or Snooze API, a backend data-base is required to store the data of user accounts, along with the frontend. The API requires the programmer to generate an API key that must be included in all requests made. The API gives directions to request a login/signup. The requests can also fetch resources from other users to be displayed, access the current user's favorite stories, the active user's contributed resources, and delete any favorited or contributed resources, and more. The Hack or Snooze API has great quickstart directions, and provides examples of how to format these requests.</p>

<h2>Cloning and Running this Project</h2>
<ol>
  <li>In the JobSearch repository, press the green "< > Code" button.</li>
  <li>From the options, at the bottom press "Download ZIP".</li>
  <li>Go to your downloads folder on your computer/machine.</li>
  <li>Find and press the "JobFinder-main.zip".</li>
  <li>A folder called "JobFinder-main" will be created in your downloads. Move this folder somewhere outside of your downloads, for example, in "Documents".</li>
  <li>In your terminal, cd into the "JobFinder-main" folder.</li>
  <li>Run the command "git init".</li>
  <li>Run the command "npm install".</li>
  <li>Run the command "git add ."</li>
  <li>Run the command "git commit -m 'adding files'" </li>
  <li>Finally, run the command "npm start" to run the project in your local browser.</li>
</ol>




