/*
 * controller.js
 *
 * Write all your code here.
 */
$(document).ready(function() { 
    $("#register").click(validate_register);
    $("#username").keypress(validate_username);
    $("#username").keyup(validate_username);
    $("#username").click(validate_username);
    $("#email").keypress(validate_email);
    $("#email").keyup(validate_email);
    $("#email").click(validate_email);
    $("#phone").keypress(validate_phone);
    $("#phone").keyup(validate_phone);
    $("#phone").click(validate_phone);
    $("#password1").keypress(validate_password1);
    $("#password1").keyup(validate_password1);
    $("#password1").click(validate_password1);
    $("#password2").keypress(validate_password2);
    $("#password2").keyup(validate_password2);
    $("#password2").click(validate_password2);
})

function display_alert() {
    if (validate_form() === true) {
        alert("form is valid")
    }
}

function is_alphaDash(str) {
    var regexp = /^[a-z0-9_]+$/i;
    if (regexp.test(str)){
        return true;
    }
    else {
        return false;
    }
}

function validate_username() {
    username = $("#username").val().trim();
    if (username.length > 5 && is_alphaDash(username)) {
        $("#username").css("background-color", "");
        $("#username_notification").text("");
    }
    else {
        $("#username").css("background-color", "red");
        $("#username_notification").text("Username is invalid");
    }
}

function validate_email() {
    email = $("#email").val().trim();
    var regexemail = /^[A-Z0-9!._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (regexemail.test(email)) {
        $("#email").css("background-color", "");
        $("#email_notification").text("");
    }
    else {
        $("#email").css("background-color", "red");
        $("#email_notification").text("Email is invalid");
    }
}

function validate_phone() {
    phone = $("#phone").val().trim();
    var regexphone = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i;
    if (regexphone.test(phone)) {
        $("#phone").css("background-color", "");
        $("#phone_notification").text("");
    }
    else {
        $("#phone").css("background-color", "red");
        $("#phone_notification").text("Phone is invalid");
    }
}

function validate_password1() {
    password1 = $("#password1").val().trim();
    var regexpassword1 = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/;
    if (password1.length > 7 && regexpassword1.test(password1)) {
        $("#password1").css("background-color", "");
        $("#password1_notification").text("");
    }
    else {
        $("#password1").css("background-color", "red");
        $("#password1_notification").text("Password is invalid");
    }
}

function validate_password2() {
    password1 = $("#password1").val().trim();
    password2 = $("#password2").val().trim();
    if (password1 == password2) {
        $("#password2").css("background-color", "");
        $("#password2_notification").text("");
    }
    else {
        $("#password2").css("background-color", "red");
        $("#password2_notification").text("Passwords don't match");
    }
}

function validate_register() {
    if (!(validate_username() || validate_email() || validate_phone() || validate_password1() || validate_password2())) {
        $("#notification").text("At least one field is invalid. Please correct it before proceeding");
    }
}

function add_update_item() {
    item_name = $("#name").val().trim();
    price = parseFloat($("#price").val());
    quantity = $("#quantity").val();
}

function validate_field(input, error, func, message) {
    if (func()) {
        input.css("background-color", "");
        error.text("");
        return true;
    }
    else {
        input.css("background-color", "red");
        error.text(message);
        return false;
    }
}