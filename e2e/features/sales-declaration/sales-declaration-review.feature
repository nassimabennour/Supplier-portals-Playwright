@mode:serial
# Both scenarios share one hardcoded supplier account — serial avoids
# racing its "current" declaration.
Feature: Sales Declaration — Review and Validate

  Background:
    Given the sales declaration feature is only available on R3S
    And the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SDV-01 | Nominal | Supplier user re-uploads and super admin validates a sales declaration
    Given the super admin opens the sales declaration creation page
    When the super admin uploads a sales declaration file
    And the super admin selects the supplier "3M"
    And the super admin selects the user "r3stest userr"
    And the super admin sets a new campaign name
    And the super admin sets a reminder date
    And the super admin confirms the sales declaration creation
    Then the sales declaration document is created successfully
    When the supplier user is logged in
    And the supplier user opens the sales declaration
    And the supplier user downloads the declaration
    And the supplier user re-uploads the corrected file
    When the super admin opens the declaration from the list
    And the super admin downloads the re-uploaded file
    And the super admin validates the declaration with a note "Reviewed and approved by automation"
    Then the sales declaration is validated
    And the supplier user can download it from their old validated declarations

  Scenario: TC-SDV-02 | Reject | Super Admin rejects a re-uploaded sales declaration
    Given the super admin opens the sales declaration creation page
    When the super admin uploads a sales declaration file
    And the super admin selects the supplier "3M"
    And the super admin selects the user "r3stest userr"
    And the super admin sets a new campaign name
    And the super admin sets a reminder date
    And the super admin confirms the sales declaration creation
    Then the sales declaration document is created successfully
    When the supplier user is logged in
    And the supplier user opens the sales declaration
    And the supplier user downloads the declaration
    And the supplier user re-uploads the corrected file
    When the super admin opens the declaration from the list
    And the super admin downloads the re-uploaded file
    And the super admin rejects the declaration with a note "Missing figures for Q3, please correct and resubmit"
    Then the sales declaration is rejected
