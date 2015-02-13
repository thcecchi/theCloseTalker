$(document).ready(function () {
  chatApp.init();

});


var chatApp = {

  config: {
    url: "http://tiy-fee-rest.herokuapp.com/collections/theclosetalker"
  },

  init: function () {
    chatApp.initStyle();
    chatApp.initEvents();
    chatApp.renderAllUsers();
    chatApp.renderAllMessages();

   /// IF USER EXISTS IN LOCAL STORAGE HIDE LOGIN FIELD ////
  /////////////////////////////////////////////////////////
   if(localStorage.LocalUser !== undefined) {
     $('.login').html(localStorage.LocalUser);
     $('#enterUserForm').css('display', 'none');
     chatApp.renderAllUsers();
   }

  },
  initEvents: function() {

     /// CREATE USER //
    //////////////////
    $('#enterUserForm').on('submit',function(e){
      e.preventDefault();

      var userInfo = {
          name: $(this).find('input[name="enterUserInput"]').val(),
          created: Date.now(),
          active: false
      };

      chatApp.createUser(userInfo);

       /// STORE USER INFO TO LOCAL STORAGE //
      localStorage.localUser = $('input[name="enterUserInput"]').val()

    });

     /// LOGOUT USER //
    //////////////////
    // $('.userListContainer').on('click', '.delete', function (event) {
    //   event.preventDefault();
    //
    //   var itemId = $('.userCard').data('userid');
    //   console.log(userId);
    //   chatApp.deleteUser(userId);
    // });


    /// CREATE MESSAGE //
    ////////////////////
    $('#enterMessageForm').on('submit',function(e){
      e.preventDefault();

      var userId = $('.messageCard').data('userid');
      var msg = $(this).find('input[name="enterMessageInput"]').val()
      var userName = localStorage.localUser

      var messageInfo = {
          name: userName,
          message: msg
      };

      chatApp.addMessage(messageInfo);

    });

    /// DELETE MESSAGE //
    ////////////////////
    $('.wrapper').on('click', '.deleteMsgIcon', function(e){
      e.preventDefault();
      var msgCardId = $(this).parent().attr('rel')
      var msgId = $('.messageCard').data('msgid');

      if (msgCardId = localStorage.localUser) {
        chatApp.deleteMessage(msgId);
      }

      else {
        alert("this ain't you fool!")
      }
    });
  },

  initStyle: function () {
    $('.messageCard').each(function (index) {
      if( $('.messageCard').attr('rel') == localStorage.localUser ) {
        console.log("'"+$('.messageCard').attr('rel') +"'")
        $('.userMessage').append('<i class="fa fa-times deleteMsgIcon"></i>');
      }
    });
  },

  render: function (data, tmpl, $el) {

    var template = _.template(data, tmpl);

    $el.append(template);

  },

  /// USER ACTIONS ////
  ////////////////////
  renderAllUsers: function () {
    $.ajax({
      url: chatApp.config.url,
      type: 'GET',
      success: function (users) {

        var compiledUserTemplate = _.template(templates.userList);

        var markup = "";

        users.forEach(function (item, idx, arr) {
          if (_.has(item, "active")) {
            markup += compiledUserTemplate(item);
          }

        });
        console.log('markup is.....', markup);
        $('.userListContainer').html(markup);
      },

      error: function (err) {
        console.log(err);
      }

    });
  },

  createUser: function (passedUser) {
    $.ajax({
      url: chatApp.config.url,
      data: passedUser,
      type: 'POST',
      success:function(data){

        console.log(passedUser);
      },
      error:function(error){
        console.log(error);
      }
    });
  },

  deleteUser: function (id) {
    $.ajax({
      url: chatApp.config.url + '/' + id,
      type: 'DELETE',
      success: function (data) {
        console.log(data);
        chatApp.renderAllUsers();
      },
      error: function (err) {
        console.log(err);
      }
    })
  },

  /// MESSAGE ACTIONS ////
  ////////////////////////

  renderAllMessages: function () {
    $.ajax({
      url: chatApp.config.url,
      type: 'GET',
      success: function (messages) {

        var compiledMessageTemplate = _.template(templates.messageList);
        var markup = "";

        messages.forEach(function (item, idx, arr) {
          if(_.has(item, "message")) {
            markup += compiledMessageTemplate(item);
          }
        });

        console.log('markup is.....', markup);
        $('.messageListContainer').html(markup);

      },

      error: function (err) {
        console.log(err);
      }

    });
  },

  addMessage: function (msg) {
    $.ajax({
      url: chatApp.config.url,
      data: msg,
      type: 'POST',
      success: function (data) {
        console.log(data);
        chatApp.renderAllMessages();
      },
      error: function (err) {
        console.log(err);
      }
    });

  },

  deleteMessage: function (id) {
    $.ajax({
      url: chatApp.config.url + '/' + id,
      type: 'DELETE',
      success: function (data) {
        console.log(data);
        chatApp.renderAllMessages();
      },
      error: function (err) {
        console.log(err);
      }
    })
  },

}
