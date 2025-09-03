from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Go to the app first
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        # Now clear storage for that origin
        page.evaluate('localStorage.clear()')
        context.clear_cookies()

        # Reload the page to apply the cleared storage
        page.reload()
        page.wait_for_load_state("networkidle")

        # Take a screenshot before the assertion
        page.screenshot(path="jules-scratch/verification/pre-assertion.png")

        # Expect the login page to be visible
        expect(page.get_by_role("button", name="Continue as Guest")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/login-page-visible.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
