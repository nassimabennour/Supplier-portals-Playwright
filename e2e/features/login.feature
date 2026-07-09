Feature: Authentification - Login
Scenario: Super Admin can login successuly
Given the super admin is on the login page
When they log in with valid credentials
Then they should be redirected after login
