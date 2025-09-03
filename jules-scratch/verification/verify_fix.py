from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        console_messages = []
        page.on("console", lambda msg: console_messages.append(msg.text))

        try:
            # Go to the app first
            page.goto("http://localhost:5173/")

            # Now clear storage for that origin
            page.evaluate('localStorage.clear()')
            context.clear_cookies()

            # Reload the page to apply the cleared storage
            page.reload()

            # Wait for a bit to let the page load and console messages to appear
            page.wait_for_timeout(2000)

            # Screenshot before assertion
            page.screenshot(path="jules-scratch/verification/debug.png")

        finally:
            browser.close()
            print("Captured Console Messages:")
            for msg in console_messages:
                print(msg)


if __name__ == "__main__":
    run_verification()
