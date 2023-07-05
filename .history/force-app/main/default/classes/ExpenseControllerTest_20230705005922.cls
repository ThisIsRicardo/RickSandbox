public with sharing class ExpenseControllerTest {
    public ExpenseControllerTest() {
        // Test Setup for the ExpenseController
        Expense__c expense = new Expense__c();
        expense.Name = 'Test Expense';
        expense.Amount__c = 100.00;
        insert expense;

        // Test Setup for the ExpenseControllerTest
        Test.setCurrentPage(Page.Expense);
        
    }
}