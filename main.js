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
   if(localStorage.localUser == undefined) {
     $('#loginWrapper').show();
     $('#mainWrapper').hide();
     $('video').show();
     $('#topBar').hide();
   }

   else {
     $('#loginWrapper').hide();
     $('#mainWrapper').show();
     $('video').hide();
     $('#topBar').show();
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

      $('#loginWrapper').hide();
      $('#mainWrapper').show();
      $('#topBar').show();
      $('video').hide();

    });

    /// DELETE USER //
    ////////////////////
    $('#mainWrapper').on('click', '.deleteUserIcon', function(e){
      e.preventDefault();
      var userCardId = $(this).parent().attr('rel')
      var userId = $(this).parent().data('userid');

      if (userCardId == localStorage.localUser) {
        chatApp.deleteUser(userId);
      }

      else {
        alert("this ain't you fool!")
      }
    });

    /// CHANGE USERNAME //
    /////////////////////
    $('#mainWrapper').on('click', '.btn-warning', function (e) {
        e.preventDefault();
        var userAlias = localStorage.localUser
        console.log(userAlias)
        $("h3:contains('" + userAlias + "')").replaceWith('<input type="text" class="updateUserName" name="updateUserName"></input>');
        $('.btn-warning').text('submit')
        var userId = $('.userCard').data('userid');
        return false;

      });

      $('#mainWrapper').on('dblclick', '.btn-warning', function (e) {
        e.preventDefault();
        var userId = $('.userCard').data('userid');
        var editedUserName = {
          name: $('.updateUserName').val()
        }

        var newName = $('.updateUserName').val()
        $(".userCard").find('input').replaceWith('<h3>' + newName + '</h3>');
        $('.btn-warning').text('Update')

        localStorage.localUser = newName;

        chatApp.updateUserName(userId, editedUserName);
        return false;

      });

     /// LOGOUT USER //
    //////////////////
    $('#logOutBtn').on('click', function (e) {
        e.preventDefault();
        chatApp.logOutUser();//enables log out
        $('#topBar').hide();
    });


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
    $('#mainWrapper').on('click', '.deleteMsgIcon', function(e){
      e.preventDefault();
      var msgCardId = $(this).parent().attr('rel')
      var msgId = $(this).parent().data('msgid');

      if (msgCardId == localStorage.localUser) {
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

  // preventDuplicateUser: function (passed) {
  //   $.ajax({
  //     url:chatApp.config.url,
  //     type:'GET',
  //     success: function(retrievedUsers){
  //       _.each(retrievedUsers, function(eachUser){
  //         if(eachUser.name.toLowerCase() === passed.name.toLowerCase()){
  //           localStorage.localUser = eachUser.name;
  //           console.log('SUCCESS: preventDuplicateUsername (\''+localStorage.localUser+'\')');
  //           renderAllUsers();
  //         }
  //       });
  //       if(!('localUser' in localStorage)){//passes off only if no matching username was found on server
  //         chatApp.createUser(passed);
  //       }
  //     },
  //     error: function(){
  //       console.log('WARNING: preventDuplicateUsername');
  //     }
  //   });
  // },

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
        chatApp.renderAllUsers();
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

  updateUserName: function (id, name) {
        $.ajax({
          url: chatApp.config.url + '/' + id,
          data: name,
          type: 'PUT',
          success: function (data) {
            console.log(data);
            chatApp.renderAllUsers();
          },
          error: function (err) {
            console.log(err);
          }
        });
    },

  logOutUser: function () {
    delete localStorage.localUser;
    console.log('SUCCESS: deleted localStorage.localUser');
    location.reload();
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
