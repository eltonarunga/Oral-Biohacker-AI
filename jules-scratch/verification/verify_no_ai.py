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

        # Check that the AI-related links are not in the sidebar
        # Use get_by_text for NavItems since they are not standard links
        expect(page.get_by_text("Personalized Plan")).not_to_be_visible()
        expect(page.get_by_text("Symptom Checker")).not_to_be_visible()
        expect(page.get_by_text("Find a Dentist")).not_to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/no-ai-features.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
