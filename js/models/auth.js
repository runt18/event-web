define(
    
['backbone', 'layoutmanager'],
function(Backbone){

var LoginView = Backbone.View.extend({
    tagName: 'iframe',

    attributes: {
        src: 'http://localhost:8080/login'
    },

    events: {
        'load': 'urlChanged'
    },

    urlChanged: function(){
        var contents = this.$el.contents();
        if(contents === 'success'){
            document.location.reload(true);
        } else if(contents === 'failure'){
            log('login failed');
        }
    }
});

var SignUpView = Backbone.View.extend({
    tagName: 'form',
    template: 'signup',

    events: {
        'blur #email': 'checkEmail',
        'keyup #email': 'validateEmail'
    },

    validateEmail: function(){
        //debugger;
        // TODO: better validation. check if the email is already in the database,
        // use a better regex etc.
        if(this.fields.email.val().match(/^.+@[a-zA-Z0-9].+\.[a-zA-Z]{2,}$/)){
            this.fields.emailValidationResponse
                .text('Email ok')
                .addClass('valid');
        } else {
            this.fields.emailValidationResponse
                .text('Email must be in the format user@site.tld')
                .removeClass('valid');
        }
    },

    checkEmail: function(){
        //debugger;
        $.get('/checkemail', function(data){
            if(data.userExists){
                // The user is logging in
            } else {
                // The user is signing up
                this.setView('#password-confirm', new PasswordFieldView());
            }
        });
    },

    render: function(manage){
        return manage(this)
            .render()
            .then(function(el){
                  this.fields = {
                    email: this.$('#email'),
                    emailValidationResponse: this.$('#email-vr')
                };
            });
    }
});

var AuthView = Backbone.View.extend({
    // A view that contains a login form and a sign up form
    tagName: 'div',
    template: 'auth',

    render: function(manage){
        this.setViews({
            '#login': new LoginView(),
            '#signup': new SignUpView()
        });
        return manage(this).render();
    }
});

return AuthView;

});

