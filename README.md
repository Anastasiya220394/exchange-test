# Overview
In this task, your objective is to build a currency exchange feature using React and TypeScript. The feature allows users to select accounts, enter an amount, and perform a currency conversion based on exchange rates fetched from a mock API. You'll be required to handle form validation, manage loading states, fetch necessary data, and ensure that the currency conversion is executed with a debounced function call.

# Requirements
## Fetch and Display Accounts:

Implement an API call to fetch account details (you will need to define the mock API).
Populate the "From Account" and "To Account" dropdowns with the accounts fetched from this API.
## Form Validation:

Implement basic validation to ensure that an account is selected for both "From Account" and "To Account."
Ensure that the amount entered does not exceed the balance available in the selected "From Account."
Display appropriate error messages if validation fails.
## Loading States:

Display a loading indicator while fetching accounts and exchange rates.
Disable form inputs during the loading state to prevent user interaction.
## Fetch Exchange Rates:

Use an API call to fetch exchange rates. You'll need to integrate this into your form handling logic.
Store the fetched exchange rates in the component's state and ensure they are up-to-date.
## Simulate Conversion with Debounce:

Implement the currency conversion logic with a debounced function call. The conversion should be triggered by changes in form values (account selections or amount).
Display the conversion result, including the original amount, converted amount, exchange rate, and fee, above the "Convert" button.
## Form Submission:

Upon form submission, validate the input and show the conversion result. No additional action is required after submission since this is a simulation.
Provided Code
You are provided with a starting point for the task, including mock data and functions. However, you will need to make key decisions and implementations to meet the requirements. 