import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';

const BASE_URL = 'http://frontend-dev';

function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function fillSignupForm(driver, username, email) {
    const usernameInput = await driver.findElement(By.css('input[type="text"][placeholder="Enter your username"]'));
    await usernameInput.sendKeys(username);

    const emailInput = await driver.findElement(By.css('input[type="email"][placeholder="Enter your email"]'));
    await emailInput.sendKeys(email);

    const passwordInput = await driver.findElement(By.css('input[type="password"][placeholder="Enter your password"]'));
    await passwordInput.sendKeys('testuseR1@example.com');

    const fileInput = await driver.findElement(By.css('input[type="file"][accept="image/*"]'));

    const encodedStringBase64 = "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAADAFBMVEUAAAAAAFUAAKoAAP8AJAAAJFUAJKoAJP8ASQAASVUASaoASf8AbQAAbVUAbaoAbf8AkgAAklUAkqoAkv8AtgAAtlUAtqoAtv8A2wAA21UA26oA2/8A/wAA/1UA/6oA//8kAAAkAFUkAKokAP8kJAAkJFUkJKokJP8kSQAkSVUkSaokSf8kbQAkbVUkbaokbf8kkgAkklUkkqokkv8ktgAktlUktqoktv8k2wAk21Uk26ok2/8k/wAk/1Uk/6ok//9JAABJAFVJAKpJAP9JJABJJFVJJKpJJP9JSQBJSVVJSapJSf9JbQBJbVVJbapJbf9JkgBJklVJkqpJkv9JtgBJtlVJtqpJtv9J2wBJ21VJ26pJ2/9J/wBJ/1VJ/6pJ//9tAABtAFVtAKptAP9tJABtJFVtJKptJP9tSQBtSVVtSaptSf9tbQBtbVVtbaptbf9tkgBtklVtkqptkv9ttgBttlVttqpttv9t2wBt21Vt26pt2/9t/wBt/1Vt/6pt//+SAACSAFWSAKqSAP+SJACSJFWSJKqSJP+SSQCSSVWSSaqSSf+SbQCSbVWSbaqSbf+SkgCSklWSkqqSkv+StgCStlWStqqStv+S2wCS21WS26qS2/+S/wCS/1WS/6qS//+2AAC2AFW2AKq2AP+2JAC2JFW2JKq2JP+2SQC2SVW2Saq2Sf+2bQC2bVW2baq2bf+2kgC2klW2kqq2kv+2tgC2tlW2tqq2tv+22wC221W226q22/+2/wC2/1W2/6q2///bAADbAFXbAKrbAP/bJADbJFXbJKrbJP/bSQDbSVXbSarbSf/bbQDbbVXbbarbbf/bkgDbklXbkqrbkv/btgDbtlXbtqrbtv/b2wDb21Xb26rb2//b/wDb/1Xb/6rb////AAD/AFX/AKr/AP//JAD/JFX/JKr/JP//SQD/SVX/Sar/Sf//bQD/bVX/bar/bf//kgD/klX/kqr/kv//tgD/tlX/tqr/tv//2wD/21X/26r/2////wD//1X//6r////qm24uAAAA1ElEQVR42h1PMW4CQQwc73mlFJGCQChFIp0Rh0RBGV5AFUXKC/KPfCFdqryEgoJ8IX0KEF64q0PPnow3jT2WxzNj+gAgAGfvvDdCQIHoSnGYcGDE2nH92DoRqTYJ2bTcsKgqhIi47VdgAWNmwFSFA1UAAT2sSFcnq8a3x/zkkJrhaHT3N+hD3aH7ZuabGHX7bsSMhxwTJLr3evf1e0nBVcwmqcTZuatKoJaB7dSHjTZdM0G1HBTWefly//q2EB7/BEvk5vmzeQaJ7/xKPImpzv8/s4grhAxHl0DsqGUAAAAASUVORK5CYII=";

    const script = `
        const input = arguments[0];
        const base64 = arguments[1];
        const fileName = arguments[2];
        const mimeType = arguments[3];
        
        function base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        const arrayBuffer = base64ToArrayBuffer(base64);
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const file = new File([blob], fileName, { type: mimeType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    `;

    await driver.executeScript(script, fileInput, encodedStringBase64, '1kb.png', 'image/png');

    await driver.wait(
        until.elementLocated(By.css('.image-preview img')),
        10000,
        'Image preview did not appear within 10 seconds'
    );

    const responseToneSlider = await driver.findElement(By.css('input[type="range"][min="1"][max="3"]'));
    await responseToneSlider.sendKeys(Key.ARROW_RIGHT, Key.ARROW_RIGHT);

    const reminderFrequencySlider = await driver.findElement(By.css('.reminder-frequency input[type="range"]'));
    await reminderFrequencySlider.sendKeys(Key.ARROW_RIGHT, Key.ARROW_RIGHT);

    const pushNotificationRadio = await driver.findElement(By.css('input[type="radio"][value="push_notification"]'));
    await pushNotificationRadio.click();

    const timePicker = await driver.findElement(By.css('input[type="time"]'));
    await timePicker.sendKeys('12:30');

    const daySelect = await driver.findElement(By.css('select'));
    await daySelect.click();
    const mondayOption = await driver.findElement(By.css('option[value="Monday"]'));
    await mondayOption.click();

    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
}

async function login(driver, email, password) {
    try {
        await driver.get(`${BASE_URL}:80/login`);

        await driver.executeScript('window.localStorage.clear();');

        const emailInput = await driver.findElement(By.css('.login-input[type="email"]'));
        await emailInput.clear();
        await emailInput.sendKeys(email);

        const passwordInput = await driver.findElement(By.css('.login-input[type="password"]'));
        await passwordInput.clear();
        await passwordInput.sendKeys(password);

        const loginButton = await driver.findElement(By.css('.submit-btn'));
        await loginButton.click();

        await driver.wait(
            until.urlContains('/chat'),
            10000,
            'Did not redirect to /chat within 10 seconds after login'
        );

        const token = await driver.executeScript('return window.localStorage.getItem("authToken");');
        if (!token) {
            throw new Error('Auth token not found in localStorage after login.');
        }
    } catch (error) {
        console.error('Login test failed:', error);
        throw error;
    }
}

describe('React App Testing - User Flows', function () {
    this.timeout(120000);

    let driver;
    let username;
    let email;

    before(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://selenium-hub:4444/wd/hub')
            .build();

        username = generateGUID() + 'testuser';
        email = generateGUID() + 'test@example.com';
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    describe('Signup Flow', function () {
        it('should load the React app and show the signup form', async () => {
            for (let attempt = 1; attempt <= 5; attempt++) {
                try {
                    await driver.get(`${BASE_URL}:80/signin`);
                    const title = await driver.getTitle();
                    expect(title).to.equal('FeelGPT');
                    break;
                } catch (error) {
                    if (attempt === 5) {
                        throw error;
                    }
                    await new Promise(res => setTimeout(res, 5000));
                }
            }
        });

        it('should display the signup form correctly', async () => {
            const formElement = await driver.wait(
                until.elementLocated(By.css('.sign-in-form')),
                10000
            );
            const formText = await formElement.getText();
            expect(formText).to.include('FeelGPT Sign Up Form');
        });

        it('should fill in the signup form, upload an image, and submit', async () => {
            await fillSignupForm(driver, username, email);

            await driver.wait(
                until.urlIs(`${BASE_URL}/chat`),
                100000,
                'Did not redirect to /chat within 20 seconds'
            );

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.equal(`${BASE_URL}/chat`);
        });
    });

    describe('Logout Flow', function () {
        it('should log out successfully', async () => {
            const profileImage = await driver.wait(
                until.elementLocated(By.css('img.user-icon')),
                10000,
                'Profile image not found within 10 seconds'
            );

            await driver.wait(
                until.elementIsVisible(profileImage),
                5000,
                'Profile image not visible'
            );
            await driver.wait(
                until.elementIsEnabled(profileImage),
                5000,
                'Profile image not enabled'
            );

            await profileImage.click();

            await driver.wait(
                until.urlContains('/my-info'),
                10000,
                'Did not navigate to /my-info within 10 seconds after clicking profile link'
            );
            const logoutButton = await driver.findElement(By.css('img.logout-icon'));

            await logoutButton.click();

            await driver.wait(
                until.urlIs(`${BASE_URL}/`),
                10000,
                'Did not redirect to / within 10 seconds after logout'
            );

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.equal(`${BASE_URL}/`);
        });
    });

    describe('Login Flow', function () {
        it('should log in with the registered user', async () => {
            await login(driver, email, 'testuseR1@example.com');

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.equal(`${BASE_URL}/chat`);
        });
    });

    describe('Chat Flow', function () {
        it('should send a message and display it', async () => {
            // Locate the textarea by ID and type a message
            const textarea = await driver.findElement(By.id('textarea-id'));
            const testMessage = 'Hello this is a test message';
            await textarea.sendKeys(testMessage);

            // Locate the send button and click it
            const sendButton = await driver.findElement(By.css('.send-button'));
            await sendButton.click();

            // await new Promise(r => setTimeout(r, 40000));


            // Define the texts to exclude
            const excludedTexts = [
                '...',
                'Welcome to FeelGPT. I am here to listen and help you reflect on your emotions. How are you feeling today?'
            ];

            // Define the maximum wait time (in milliseconds)
            const maxWaitTime = 25000; // 25 seconds

            // Define a custom condition for waiting
            const condition = async () => {
                // Locate all elements with parent class 'message them'
                const messageElements = await driver.findElements(By.css('.them'));

                for (let element of messageElements) {
                    try {

                        const messageElement = await element.findElement(By.css('.message-border'));

                        const text = await messageElement.getText();
                        // Check if the text matches the test message and is not in excluded texts
                        if (!excludedTexts.includes(text)) {
                            return messageElement;
                        }
                    } catch (error) {
                        // Handle any potential errors (e.g., stale elements)
                        console.error('Error retrieving text from element:', error);
                    }
                }

                // If no matching element is found yet, return false to continue waiting
                return false;
            };

            // Wait until the condition is met or the timeout is reached
            const foundElement = await driver.wait(
                condition,
                maxWaitTime,
                'Valid response did not appear in the chat within 25 seconds'
            );
            expect(foundElement).to.exist;
        });
    });

    describe('Edit profile flow', function () {
        it('should navigate to user profile', async () => {
            const profileImage = await driver.wait(
                until.elementLocated(By.css('img.user-icon')),
                10000,
                'Profile image not found within 10 seconds'
            );

            await driver.wait(
                until.elementIsVisible(profileImage),
                5000,
                'Profile image not visible'
            );
            await driver.wait(
                until.elementIsEnabled(profileImage),
                5000,
                'Profile image not enabled'
            );

            await profileImage.click();

            await driver.wait(
                until.urlContains('/my-info'),
                10000,
                'Did not navigate to /my-info within 10 seconds after clicking profile link'
            );

            await driver.wait(
                until.urlContains('/my-info'),
                10000,
                'Did not redirect to /my-info within 10 seconds after login'
            );
        });

        it('should edit user information', async () => {
            const updateButton = await driver.findElement(By.css('.manage'));
            await updateButton.click();

            await driver.wait(until.elementLocated(By.css('.overlay-content')), 5000);

            const emailInput = await driver.findElement(By.css('input[type="email"]'));
            await emailInput.clear();
            await emailInput.sendKeys(generateGUID() + 'newemail@example.com');

            const saveButton = await driver.findElement(By.css('.summary-button'));
            await saveButton.click();

            const successMessage = await driver.wait(
                until.elementLocated(By.css('.success-message')),
                5000,
                'Success message not found'
            );
            const message = await successMessage.getText();
            expect(message).to.contain('Settings updated successfully.');
        });
    });
});
