var templates = {};

templates.userList = [
"<div class='userCard' rel='<%= name %>' data-userid='<%= _id %>'>",
"<h4 class='userName'><%= name %></h3>",
'<i class="fa fa-times deleteUserIcon" rel="<%= name %>"></i>',
"</div>"
].join("")

templates.messageList = [
"<div class='messageCard' rel='<%= name %>' data-msgid='<%= _id %>'>",
"<h5 class='userName'><%= name %></h5>",
"<p class='userMessage'><%= message %></p>",
'<i class="fa fa-times deleteMsgIcon" rel="<%= name %>"></i>',
"</div>"
].join("")
