window.JST = {};

window.JST["plan/main"] = "<div id=\"header\"></div><div role=\"main\" id=\"main\">    <div id=\"login-wrapper\"></div>    <div id=\"name\">        <div class=\"banner\" id=\"banner-\">            <h3>What&apos;s happening?</h3>        </div>        <hr>        <div id=\"main-details\"></div>    </div>    <div id=\"times-wrapper\"></div>    <div id=\"optional-wrapper\"></div>    <div id=\"finish-button-wrapper\"></div>    <div id=\"finish-wrapper\"></div></div><div id=\"footer\"></div>";
window.JST["header"] = "<div class=\"left\">    <a href=\"index.html\">        <div class=\"logo\">Eventual</div>    </a>    <% if(page_title){ %>        <div>&raquo;</div>            <div class=\"page-title\">            <%= page_title %>        </div>    <% } %> </div><nav class=\"right\">    <a href=\"plan.html\">New Event</a>    <a href=\"view.html\">View Events</a>    <a id=\"login-button\">Login/Join</a></nav>";
window.JST["footer"] = "<div class=\"left\">	Made by <a href=\"http://clementin.es\">Clementine</a></div>";
window.JST["auth"] = "<h2>Login</h2><div id=\"login\"></div><h2>Or Sign Up</h2><div id=\"signup\"></div>";
window.JST["plan/optional"] = "<div class=\"banner\">    <h3>Optional</h3>    <div class=\"expander-wrap\"></div></div><div class=\"panels\">    <div class=\"left-panel\">        <input id=\"location\" type=text placeholder=\"Where is it?\"></input>        <input type=\"button\" id=\"toggle-map\" value=\"Map\"></input>        <br>        <span class=\"hint\">A name for the place that your friends will recognise</span>        <textarea id=\"description\" placeholder=\"Other details\"></textarea>    </div>    <div class=\"right-panel\">        <div id=\"map-wrap\"></div>    </div></div>";
window.JST["plan/details"] = "<input type=\"text\" placeholder=\"What's it called?\"></input><br><input type=\"text\" id=\"invitees\" placeholder=\"Who's invited?\"></input><span class=\"hint\">A comma separated list of names or email addresses</span>";
window.JST["plan/times"] = "<div class=\"banner\">    <h3>When can it happen?</h3>    <input type=\"button\" id=\"add-time\" value=\"+\"></input></div><div id=\"times\"></div>";
window.JST["plan/time"] = "  <input value=\"<%= timestring %>\" class=\"start\" type=\"text\"> for<input class=\"duration\" value=\"<%= duration %>\" type=\"text\"></input> minutes on<input value=\"<%= datestring %>\" class=\"date\" type=\"text\"></input><input type=\"button\" class=\"remove\" value=\"X\"></input>";
window.JST["finishbutton"] = "<input type=\"button\" id=\"finish\" value=\"Finish\"></input>";
window.JST["signup"] = "<div class=\"validation-wrap\">	<input id=\"email\" type=\"text\" placeholder=\"Email\">	<span class=\"hint validation-response\" id=\"email-vr\"></span></div><div class=\"validation-wrap\">	<input id=\"password\" type=\"password\" placeholder=\"Password\">	<span class=\"hint validation-response\" id=\"password-vr\"></span></div><input id=\"login-submit\" type=\"button\" value=\"Login / Sign up\">";