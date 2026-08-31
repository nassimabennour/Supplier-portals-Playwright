Feature: Sales Declaration — Create

  Background:
    Given the sales declaration feature is only available on R3S
    And the super admin is logged in
    And cookies are accepted if present

  Scenario: TC-SDC-01 | Nominal | Super Admin creates a sales declaration
    Given the super admin opens the sales declaration creation page
    When the super admin uploads a sales declaration file
    And the super admin selects the supplier "3M"
    And the super admin selects the user "r3stest userr"
    And the super admin sets a new campaign name
    And the super admin sets a reminder date
    And the super admin confirms the sales declaration creation
    Then the sales declaration document is created successfully

  Scenario: TC-SDC-02 | Cancel | Super Admin cancels creating a sales declaration
    Given the super admin opens the sales declaration creation page
    When the super admin selects the supplier "3M"
    And the super admin cancels the sales declaration creation
    Then the super admin returns to the sales declaration list

  Scenario: TC-SDC-03 | Invalid file type | Super Admin cannot upload an unsupported file
    Given the super admin opens the sales declaration creation page
    When the super admin uploads a file of an unsupported type
    Then the file is rejected with the message "Your file format is not supported (use xls, xlsx or xlsm)"

  Scenario: TC-SDC-04 | Oversized file | Super Admin cannot upload a file exceeding the size limit
    Given the super admin opens the sales declaration creation page
    When the super admin uploads a file exceeding the size limit
    Then the file is rejected with the message "Your file is too big (max. 2 Mo)"
