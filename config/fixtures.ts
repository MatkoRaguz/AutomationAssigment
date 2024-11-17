import {test as base} from '@playwright/test';
import {HomePage} from '../pages/HomePage';
import {CarListingPage} from '../pages/CarListingPage';

type MyFixture = {
    homePage: HomePage;
    carListingPage: CarListingPage;
};

export const test = base.extend<MyFixture>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },
    carListingPage: async ({page}, use) => {
        await use(new CarListingPage(page));
    },
});

export {expect} from '@playwright/test';
