import {test} from '../config/fixtures';
import {expect} from '@playwright/test';
import testCases from '../test-data/requirements';

testCases.forEach((testCase) => {
    test(testCase.description, async ({page, homePage, carListingPage}) => {
        await homePage.goTo(testCase.url ?? '');
        await homePage.acceptCookieConsent();
        await homePage.acceptEuPrivacyConsent();

        await homePage.search(testCase.searchTerm);
        await homePage.selectCategoryFromSuggestions(testCase.searchTerm);

        const vehicleBrand = [
            carListingPage.carCategoryTitle,
            carListingPage.careBreadCrumbs,
            carListingPage.carType,
            carListingPage.carCategoryListing,
            carListingPage.carCategoryDescription,
        ];
        await Promise.all(
            vehicleBrand.map(async (title) => {
                await expect(title).toContainText(testCase.searchTerm);
            })
        );

        await carListingPage.applyYearOfManufactureFilter(
            testCase.yearFrom,
            testCase.yearTo
        );
        await carListingPage.applyMileageFilter(testCase.minKm, testCase.maxKm);

        await expect(carListingPage.setYearFrom).toHaveValue(
            testCase.yearFrom.toString()
        );
        await expect(carListingPage.setYearTo).toHaveValue(
            testCase.yearTo.toString()
        );
        await expect(carListingPage.setMileageMin).toHaveValue(
            testCase.minKm.toString()
        );
        await expect(carListingPage.setMileageMax).toHaveValue(
            testCase.maxKm.toString()
        );

        await carListingPage.submitButton();

        for (const carMileage of await carListingPage.getAllCarMileages()) {
            expect(carMileage).toBeLessThanOrEqual(testCase.maxKm);
        }

        for (const carYear of await carListingPage.getAllCarYearOfManufacture()) {
            expect(carYear).toBeGreaterThanOrEqual(testCase.yearFrom);
            expect(carYear).toBeLessThanOrEqual(testCase.yearTo);
        }

        await page.close();
    });
});
