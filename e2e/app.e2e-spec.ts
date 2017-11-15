import { LibraryManagementPage } from './app.po';

describe('library-management App', function() {
  let page: LibraryManagementPage;

  beforeEach(() => {
    page = new LibraryManagementPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
