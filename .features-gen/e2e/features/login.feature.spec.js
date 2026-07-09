// Generated from: e2e\features\login.feature
import { test } from "playwright-bdd";

test.describe('Authentification - Login', () => {

  test('Super Admin can login successuly', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they log in with valid credentials', null, { page }); 
    await Then('they should be redirected after login', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":2,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":3,"keywordType":"Context","textWithKeyword":"Given the super admin is on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":4,"keywordType":"Action","textWithKeyword":"When they log in with valid credentials","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then they should be redirected after login","stepMatchArguments":[]}]},
]; // bdd-data-end