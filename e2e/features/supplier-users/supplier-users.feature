Feature: Supplier User — Creation

  Background:
    Given the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SUC-01 | Nominal | Super Admin creates a supplier user with default access rights
    # Navigate to creation wizard
    Given the super admin is on the supplier user creation page

    # Step 1 — Account details
    Then the stepper is on step "account-details"
    When the super admin fills in the account details with valid data
    And clicks Next step

    # Step 2 — Access Rights
    Then the stepper advances to step "access-rights"
    When the super admin grants all available access rights

    # Step 3 — Summary
    Then the stepper advances to step "summary"
    And the summary displays all the entered user details correctly
    When the super admin confirms the creation

    # Step 4 — Confirmation
    Then the stepper advances to step "confirmation"
    And the supplier user is created successfully

    # Verify user appears in the list
    When the super admin navigates to the supplier user list
    Then the newly created supplier user appears in the list
