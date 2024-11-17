import {type Locator, type Page} from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchSuggestions: Locator;
    readonly cookieConsentButton: Locator;
    readonly euPrivacyConsentButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#keywords');
        this.searchSuggestions = page.locator('.categories.item');
        this.cookieConsentButton = page.locator('#didomi-notice-agree-button');
        this.euPrivacyConsentButton = page.locator(
            '.PrivacyPolicyNotice-close--asButton'
        );
    }

    async goTo(url: string) {
        await this.page.goto(url);
    }

    async acceptCookieConsent() {
        await this.cookieConsentButton.click();
    }

    async acceptEuPrivacyConsent() {
        const currentUrl = await this.page.url();
        if (currentUrl.includes('njuskalo'))
            await this.euPrivacyConsentButton.click();
    }

    async search(term: string) {
        await this.searchInput.fill(term);
    }

    async selectCategoryFromSuggestions(category: string) {
        await this.searchSuggestions.nth(0).waitFor();
        const suggestions = await this.searchSuggestions.all();

        for (const suggestion of suggestions) {
            const text = await suggestion.textContent();
            if (text?.trim() === category) {
                await suggestion.click();
                break;
            }
        }
    }
}
