import { AppPage } from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Welcome to the demo of @politie/ngx-sherlock');
    });

    it('should update the time every second', async () => {
        page.navigateTo();
        const currentAutoCDTime = await page.getAutoCDClock();
        const currentPipeTime = await page.getPipeClock();
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(page.getAutoCDClock()).not.toEqual(currentAutoCDTime);
        expect(page.getPipeClock()).not.toEqual(currentPipeTime);
    });
});
