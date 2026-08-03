Feature: Supplier User — Edit

  Background:
    Given the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SUE-01 | Nominal | Super Admin edits a supplier user's account details
    Given the super admin is on the supplier user list page
    When the super admin opens the seed edit user from the list
    And the super admin switches to edit mode
    And the super admin updates the account details with new data
    And the super admin saves the changes
    Then the supplier user details match the new data
