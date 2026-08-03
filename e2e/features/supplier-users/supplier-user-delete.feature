Feature: Supplier User — Delete

  Background:
    Given the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SUD-01 | Nominal | Super Admin deletes a supplier user
    Given the super admin has created a new supplier user to delete
    When the super admin opens the newly created user from the list
    And the super admin deletes the account
    Then the supplier user is removed from the list
