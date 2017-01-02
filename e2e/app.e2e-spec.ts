import { WebsocketLabPage } from './app.po';

describe('websocket-lab App', function() {
  let page: WebsocketLabPage;

  beforeEach(() => {
    page = new WebsocketLabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
