window.JST = {};

window.JST["view/main"] = "<div id=\"header\"></div><div role=\"main\" id=\"main\">    <div id=\"login-wrapper\"></div>    <div>        <div id=\"details\"></div>    </div>    <div>        <div class=\"banner\">            <h3>Who&apos;s coming?</h3>        </div>        <hr>        <div id=\"global-attendees\"></div>    </div>    <div>        <div class=\"banner\">            <h3>Possible Times</h3>            <span class=\"hint\">(Tick the ones you can attend)</span>        </div>        <hr>        <div id=\"times\"></div>    </div>    <div>        <div class=\"banner\">            <h3>Chat</h3>        </div>        <hr>        <div id=\"chat\"></div>    </div>    <hr>    <div id=\"finish-button-wrapper\"></div>    <div id=\"finish-wrapper\"></div></div><div id=\"footer\"></div>";
window.JST["header"] = "<div class=\"left\">    <a href=\"index.html\">        <div class=\"logo\">Eventual</div>    </a>    <% if(page_title){ %>        <div>&raquo;</div>            <div class=\"page-title\">            <%= page_title %>        </div>    <% } %> </div><nav class=\"right\">    <a href=\"plan.html\">New Event</a>    <a href=\"view.html\">View Events</a>    <a id=\"login-button\">Login/Join</a></nav>";
window.JST["footer"] = "<div class=\"left\">	Made by <a href=\"http://clementin.es\">Clementine</a></div>";
window.JST["auth"] = "<h2>Login</h2><div id=\"login\"></div><h2>Or Sign Up</h2><div id=\"signup\"></div>";
window.JST["view/details"] = "<div class=\"banner clearfix\">    <h3><%= name %> at <%= location %></h3></div><hr><p id=\"description\"><%= description %></p>";
window.JST["view/time"] = "<div class=\"time-details\">    <input class=\"tick\" type=\"checkbox\">    <p>        At <strong><%= timestring %></strong> for        <strong><%= duration %></strong> minutes on        <strong><%= datestring %></strong>    </p></div><div class=\"clearfix\"></div><div class=\"attendee-details\">    <div class=\"piechart-wrap\"></div>    <p><strong><%= numAttending %></strong>/<strong><%= total %></strong> can make it</p>    <div class=\"expander-wrap\"></div></div><div class=\"attendees-wrap\"></div>";
window.JST["view/finishbox"] = "<h2>The event has been created!</h2><p>You have arranged an Event at Place at Time for Duration on Date. 75% of people you invited can make it. This is the highest percentage of all possible times.</p><p>How would you like to be reminded of this event?</p><span class=\"hint\">(tick all that apply)</span><form>	<input type=\"checkbox\"><label>Email</label><br>	<input type=\"checkbox\"><label>Google Calendar</label>	<br>	<input type=\"button\" value=\"Confirm and close\"></form>";
window.JST["finishbutton"] = "<input type=\"button\" id=\"finish\" value=\"Finish\"></input>";
window.JST["signup"] = "<div class=\"validation-wrap\">	<input id=\"email\" type=\"text\" placeholder=\"Email\">	<span class=\"hint validation-response\" id=\"email-vr\"></span></div><div class=\"validation-wrap\">	<input id=\"password\" type=\"password\" placeholder=\"Password\">	<span class=\"hint validation-response\" id=\"password-vr\"></span></div><input id=\"login-submit\" type=\"button\" value=\"Login / Sign up\">";
window.JST["view/chat"] = "<textarea id=\"chat-window\"></textarea><br><input type=\"text\" id=\"chat-entry\">";
window.JST["view/attendee"] = "<%= name %>";
