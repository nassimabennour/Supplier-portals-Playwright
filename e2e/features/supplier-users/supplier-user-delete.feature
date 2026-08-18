Feature: Supplier User — Delete

  Background:
    Given the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SUD-01 | Nominal | Super Admin deletes a supplier user
    Given the super admin has created a new supplier user to delete
    When the super admin opens the newly created user from the list
    And the super admin opens the delete confirmation
    And the super admin confirms the deletion
    Then the supplier user is removed from the list

  Scenario: TC-SUD-02 | Cancel | Super Admin cancels deleting a supplier user
    Given the super admin has created a new supplier user to test cancelling deletion
    When the super admin opens the newly created user from the list
    And the super admin opens the delete confirmation
    And the super admin declines the deletion
    Then the supplier user still appears in the list
