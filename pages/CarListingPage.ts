import {type Locator, type Page} from '@playwright/test';

export class CarListingPage {
    readonly page: Page;
    readonly careBreadCrumbs: Locator;
    readonly carCategoryTitle: Locator;
    readonly carCategoryDescription: Locator;
    readonly carCategoryListing: Locator;
    readonly carType: Locator;
    readonly setYearFrom: Locator;
    readonly setYearTo: Locator;
    readonly setMileageMin: Locator;
    readonly setMileageMax: Locator;
    readonly carDescriptionVauVau: Locator;
    readonly carDescriptionRegular: Locator;

    constructor(page: Page) {
        this.page = page;
        this.careBreadCrumbs = page.locator('.breadcrumb-item.is-active');
        this.carType = page.locator('.selectr-tag');
        this.carCategoryTitle = page.locator('.ContentHeader-title');
        this.carCategoryDescription = page.locator('.ContentHeader-description');
        this.carCategoryListing = page.locator('.CategoryListing-topCategories');
        this.setYearFrom = page.locator("select[id='yearManufactured[min]']");
        this.setYearTo = page.locator("select[id='yearManufactured[max]']");
        this.setMileageMin = page.locator("input[name='mileage[min]']");
        this.setMileageMax = page.locator("input[name='mileage[max]']");
        this.carDescriptionVauVau = page.locator(
            'li.EntityList-item--VauVau .entity-body .entity-description'
        );
        this.carDescriptionRegular = page.locator(
            'li.EntityList-item--Regular .entity-body .entity-description'
        );
    }

    async applyYearOfManufactureFilter(yearFrom: number, yearTo: number) {
        await this.setYearFrom.selectOption(yearFrom.toString());
        await this.setYearTo.selectOption(yearTo.toString());
    }

    async applyMileageFilter(minKm: number, maxKm: number) {
        await this.setMileageMin.fill(minKm.toString());
        await this.setMileageMax.fill(maxKm.toString());
    }

    async submitButton() {
        await this.page.click('#submitButton');
    }

    async getAllCarMileages(): Promise<number[]> {
        const url = this.page.url();
        const rawMileages = url.includes('njuskalo')
            ? [
                ...(await this.carDescriptionVauVau.allTextContents()),
                ...(await this.carDescriptionRegular.allTextContents()),
            ]
            : await this.carDescriptionRegular.allTextContents();

        return rawMileages
            .map((text) => text.trim())
            .map((text) => parseInt(text.split(' ')[2]));
    }

    async getAllCarYearOfManufacture(): Promise<number[]> {
        const url = this.page.url();
        const rawYearOfManufacture = url.includes('njuskalo')
            ? [
                ...(await this.carDescriptionVauVau.allTextContents()),
                ...(await this.carDescriptionRegular.allTextContents()),
            ]
            : await this.carDescriptionRegular.allTextContents();

        return rawYearOfManufacture
            .map((text) => {
                const yearMatch = text.match(/Godište automobila:\s*(\d{4})/);
                return yearMatch ? parseInt(yearMatch[1], 10) : null;
            })
            .filter((year): year is number => year !== null);
    }
}
