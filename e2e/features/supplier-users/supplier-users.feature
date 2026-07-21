Feature: Supplier User - Creation

    Scenario: Super Admin can create a new supplier user
        Given the super admin is logged in
        When they create a new supplier user with valid details
        Then the supplier user should be created successfully
