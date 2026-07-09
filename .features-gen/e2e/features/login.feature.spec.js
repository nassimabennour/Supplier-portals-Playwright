// Generated from: e2e\features\login.feature
import { test } from "playwright-bdd";

test.describe('Authentification - Login', () => {

  test('Super Admin can login successuly', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they log in with valid credentials', null, { page }); 
    await Then('they should be redirected after login', null, { page }); 
  });

  test('Login fails with wrong password', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they log in with a wrong password', null, { page }); 
    await Then('they should see a login error', null, { page }); 
  });

  test('Login fails with empty fields', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they submit the login form without filling any field', null, { page }); 
    await Then('they should see a required field error', null, { page }); 
  });

  test('Login fails with unknown email', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they log in with an unknown email', null, { page }); 
    await Then('they should see a login error', null, { page }); 
  });

  test('Login fails with invalid email format', async ({ Given, When, Then, page }) => { 
    await Given('the super admin is on the login page', null, { page }); 
    await When('they enter an invalid email format', null, { page }); 
    await Then('they should see an invalid email format error', null, { page }); 
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
  {"pwTestLine":12,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the super admin is on the login page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When they log in with a wrong password","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then they should see a login error","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":19,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given the super admin is on the login page","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When they submit the login form without filling any field","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then they should see a required field error","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":17,"tags":[],"steps":[{"pwStepLine":25,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given the super admin is on the login page","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When they log in with an unknown email","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then they should see a login error","stepMatchArguments":[]}]},
  {"pwTestLine":30,"pickleLine":22,"tags":[],"steps":[{"pwStepLine":31,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"Given the super admin is on the login page","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When they enter an invalid email format","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then they should see an invalid email format error","stepMatchArguments":[]}]},
]; // bdd-data-end