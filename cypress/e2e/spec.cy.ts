// Disable Cypress retry mechanism as it will retry a couple of times, each with a pause of a second.
// For the tests we want to check that after one second the value has changed so it is better not to
// rely on the framework to do the waiting, instead we use cy.wait(1100).
const noRetries = {
  runMode: 0,
  openMode: 0,
};

describe('workspace-project App', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('app-root h1').contains('Welcome to the demo of @politie/ngx-sherlock');
  });

  it('should update the auto changedetection every second', { retries: noRetries }, done => {
    cy.visit('/');
    checkTime(getAutoCDClock, done);
  });

  it('should update the value pipe every second', { retries: noRetries }, done => {
    cy.visit('/');
    checkTime(getPipeClock, done);
  });

  it('should update the value proxy pipe every second', { retries: noRetries }, done => {
    cy.visit('/');
    checkTime(getProxyPipeClock, done);
  });
});

const checkTime = (func: () => Cypress.Chainable<JQuery<HTMLElement>>, done: Mocha.Done) => {
  func().invoke('text').then((timeFirst) => {
    cy.wait(1100);
    func().invoke('text').then((timeSecond) => {
      expect(timeSecond).not.to.equal(timeFirst);
      done();
    });
  });
};

const getAutoCDClock = () => {
  return cy.get('app-auto-change-detection-service time').first();
};

const getPipeClock = () => {
  return cy.get('app-value-pipe time.base-clock').first();
};

const getProxyPipeClock = () => {
  return cy.get('app-value-pipe time.base-clock').last();
};
