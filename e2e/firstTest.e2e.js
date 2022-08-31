describe('Login flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('로그인 성공여부', async () => {
    await element(by.id('loginId')).tap()
    await element(by.id('loginId')).typeText('dnb_0006')
    await element(by.id('loginPwd')).tap()
    await element(by.id('loginPwd')).typeText('1111')
    await element(by.text('로그인')).tap()

    await expect(element(by.id('openDrawer'))).toBeVisible()
    await element(by.id('openDrawer')).tap()
    await element(by.id('drawerMenuScrollView')).scroll(100)
    await element(by.id('Reviews')).tap()
    await expect(element(by.id('reviewScreen'))).toBeVisible()
    await element(by.id('reviewFlatList')).scroll(500)
    await element(by.id('openDrawer')).tap()
    await element(by.id('Notice')).tap()
    await expect(element(by.id('noticeScreen'))).toBeVisible()
    await element(by.id('openDrawer')).tap()
    await element(by.id('drawerMenuScrollView')).scroll(100)
    await element(by.id('logout')).tap()
    await element(by.id('loginId')).tap()
    await element(by.id('loginId')).typeText('dnb_0006')
    await element(by.id('loginPwd')).tap()
    await element(by.id('loginPwd')).typeText('1111')
    await element(by.text('로그인')).tap()

    // await expect(element(by.text('World!!!'))).toBeVisible();
  });

  // it('주문내역 페이지', async () => {
  //   await expect(element(by.id('openDrawer'))).toBeVisible()
  //   await element(by.id('openDrawer')).tap()
  // })
});