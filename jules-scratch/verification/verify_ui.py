from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the app
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        # Login as guest
        page.get_by_role("button", name="Continue as Guest").click()

        # Expect the dashboard to be visible
        expect(page.get_by_role("heading", name="Welcome, Guest")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/ui-improvements.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
