import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }

    getAutoCDClock() {
        return element.all(by.css('app-auto-change-detection-service time')).first().getText();
    }

    getPipeClock() {
        return element.all(by.css('app-value-pipe time')).first().getText();
    }
}
