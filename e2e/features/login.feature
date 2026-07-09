Feature: Authentification - Login
    Scenario: Super Admin can login successuly
        Given the super admin is on the login page
        When they log in with valid credentials
        Then they should be redirected after login

    Scenario: Login fails with wrong password
        Given the super admin is on the login page
        When they log in with a wrong password
        Then they should see a login error

    Scenario: Login fails with empty fields
        Given the super admin is on the login page
        When they submit the login form without filling any field
        Then they should see a required field error

    Scenario: Login fails with unknown email
        Given the super admin is on the login page
        When they log in with an unknown email
        Then they should see a login error

    Scenario: Login fails with invalid email format
        Given the super admin is on the login page
        When they enter an invalid email format
        Then they should see an invalid email format error