@isTest
private class ExpenseControllerTest {

    @testSetup static void setup() {
        // Create test data
        Credit_Card__c recruitmentCreditCard = new Credit_Card__c();
        recruitmentCreditCard.Name = 'Fabi Credit Card';
        recruitmentCreditCard.Expiration_Date__c = Date.newInstance(2023, 12, 31);
        recruitmentCreditCard.Credit_Card_Number__c = '4433';
        insert recruitmentCreditCard;

        Credit_Card__c employeeCreditCard = new Credit_Card__c();
        employeeCreditCard.Name = 'Morena Credit Card';
        employeeCreditCard.Expiration_Date__c = Date.newInstance(2023, 12, 31);
        employeeCreditCard.Credit_Card_Number__c = '4433';
        insert employeeCreditCard;

        Credit_Card_Amount__c creditCardStatement = new Credit_Card_Amount__c();
        creditCardStatement.Name = 'Credit Card Statement January 2023';
        creditCardStatement.Credit_Card__c = recruitmentCreditCard.Id;
        creditCardStatement.Month__c = 'January';
        insert creditCardStatement;

        Annual_Budget__c recruitmentAB = new Annual_Budget__c();
        RecruitmentAB.Name = 'Recruitment, Trainees and Marketing 2023';
        RecruitmentAB.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        RecruitmentAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        RecruitmentAB.Closed_Date__c = Date.newInstance(2023, 12, 31);
        RecruitmentAB.Expected_Mid_Year_Review__c = Date.newInstance(2023, 6, 30);
        insert RecruitmentAB;

        Subcategory__c recruitmentSubcategory = new Subcategory__c();
        recruitmentSubcategory.Name = 'Fabi Team Building';
        recruitmentSubcategory.Category__c = 'Recruitment, Trainees and Marketing';
        recruitmentSubcategory.Annual_Budget__c = recruitmentAB.Id;
        recruitmentSubcategory.Annual_Amount__c = 90000;
        insert recruitmentSubcategory;


        // Create a List with all the months of the year
        List<String> months = new List<String>();
        // Add all of them in a single line
        months.addAll(new List<String>{'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'});

        // Now create a Budget List
        List<Budget__c> budgets = new List<Budget__c>();
        // Create a Budget for each month and add it to the list of Budgets
        for (String month : months) {
            Budget__c budget = new Budget__c();
            budget.Name = 'Fabi Team Building ' + month + ' 2023';
            budget.Subcategory__c = recruitmentSubcategory.Id;
            budget.Month__c = month;
            budget.Monthly_Amount__c = 7500;
            budget.Year__c = '2023';
            budgets.add(budget);
        }
        // Insert all the Budgets at once
        insert budgets;

        Annual_Budget__c employeeAB = new Annual_Budget__c();
        EmployeeAB.Name = 'Employee Experience and Development 2023';
        EmployeeAB.Budget_Category__c = 'Employee Experience and Development';
        EmployeeAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        EmployeeAB.Closed_Date__c = Date.newInstance(2023, 12, 31);
        EmployeeAB.Expected_Mid_Year_Review__c = Date.newInstance(2023, 6, 30);
        insert EmployeeAB;

        Subcategory__c employeeSubcategory = new Subcategory__c();
        employeeSubcategory.Name = 'Morena Team Building';
        employeeSubcategory.Category__c = 'Employee Experience and Development';
        employeeSubcategory.Annual_Budget__c = employeeAB.Id;
        employeeSubcategory.Annual_Amount__c = 90000;
        insert employeeSubcategory;

        List<Budget__c> employeeBudgets = new List<Budget__c>();
        // Create a Budget for each month and add it to the list of Budgets
        for (String month : months) {
            Budget__c employeeBudget = new Budget__c();
            employeeBudget.Name = 'Morena Team Building ' + month + ' 2023';
            employeeBudget.Subcategory__c = employeeSubcategory.Id;
            employeeBudget.Month__c = month;
            employeeBudget.Monthly_Amount__c = 7500;
            employeeBudget.Year__c = '2023';
            employeeBudgets.add(employeeBudget);
        }
        // Insert all the Budgets at once
        insert employeeBudgets;


        // Creation of 10 Expense for testing with a for loop
        List <Expense__c> expensesList = new List <Expense__c>();
        Integer numberOfExpenses = 10;
        for (Integer i = 0; i <= numberOfExpenses; i++){
            Expense__c testExpense = new Expense__c();
            testExpense.Transaction_Date__c = Date.today();
            testExpense.Name = 'testExpense' + i;
            testExpense.Subcategory__c = employeeSubcategory.Id;
            testExpense.Amount_Spent__c = 450;
            testExpense.Credit_Card_Statement__c = creditCardStatement.Id;
            testExpense.Associated_Credit_Card__c = recruitmentCreditCard.Id;
            expensesList.add(testExpense);
        }
        insert expensesList;

        // Creation of 10 Team Members using a for loop
        List <Team_Member__c> teamMembersList = new List <Team_Member__c>();
        Integer numberOfTeamMembers = 10;
        for (Integer i = 0; i <= numberOfTeamMembers; i++){
            Team_Member__c testTeamMember = new Team_Member__c();
            testTeamMember.Name = 'Wubba Lubba Dub Dub' + i;
            testTeamMember.Cost_Item__c = recruitmentSubcategory.Category__c;
            testTeamMember.Hiring_Date__c = Date.today();
            testTeamMember.AFP__c = 'CONFIA';
            testTeamMember.NIT__c = '123456789';
            testTeamMember.Birthdate__c = Date.newInstance(2000, 6, 28);
            testTeamMember.Contract_Status__c = 'Professional Services';
            testTeamMember.Country__c = 'El Salvador';
            testTeamMember.Gender__c = 'F';
            testTeamMember.Department__c = 'Operations';
            testTeamMember.Job_Title__c = 'Software Developer';
            testTeamMember.Organization_Status__c = 'Trainee';
            testTeamMember.Phone_Number__c = '12345678';
            testTeamMember.Risk_of_Leaving__c = 'Low';
            testTeamMember.Hiring_Date_Payroll_DP__c = Date.today();
            testTeamMember.Hiring_Date_Professional_Services_DP__c = Date.today();
            testTeamMember.Hiring_Date_Professional_Services__c = Date.today();
            testTeamMember.DUI__c = '12345678-9';
            teamMembersList.add(testTeamMember);
            
        }
        insert teamMembersList;
    }


    @isTest
    static void testSaveExpenses() {

        Subcategory__c  recruitmentSubcategory = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        Credit_Card_Amount__c creditCardStatement = [SELECT Id FROM Credit_Card_Amount__c WHERE Name = 'Credit Card Statement January 2023' LIMIT 1];
        Credit_Card__c recruitmentCreditCard = [SELECT Id FROM Credit_Card__c WHERE Name = 'Fabi Credit Card' LIMIT 1];
        // Prepare data
        Expense__c testExpense = new Expense__c();
        testExpense.Transaction_Date__c = Date.today();
        testExpense.Name = 'testExpense';
        testExpense.Subcategory__c = recruitmentSubcategory.Id;
        testExpense.Amount_Spent__c = 450;
        testExpense.Credit_Card_Statement__c = creditCardStatement.Id;
        testExpense.Associated_Credit_Card__c = recruitmentCreditCard.Id;
        testExpense.Receipt_Type__c = 'Digital - Recibo';
        // Fill in the necessary fields...
        
        Test.startTest();
        Expense__c result = ExpenseController.saveExpenses(testExpense);
        Test.stopTest();
        
        // Asserts
        System.assertNotEquals(null, result, 'Expense should be saved');
    }

    @isTest
    static void testSaveExpensesError() {
        // Create an Expense__c object without required fields.
        Expense__c testExpense = new Expense__c();
        testExpense.Name = 'THIS IS A LONG MESSAGE TO TEST THE EXCEPTION BECAUSE THIS FIELD HASA CHARACTER LIMIT OF 80AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    
        Exception expectedException;
        Test.startTest();
        try {
            // This should cause an exception to be thrown
            Expense__c result = ExpenseController.saveExpenses(testExpense);
        } catch (AuraHandledException e) {
            expectedException = e;
        }
        Test.stopTest();
    
        // Assert that an exception was thrown
        System.assertNotEquals(null, expectedException, 'An exception should have been thrown');
        System.assertEquals('Script-thrown exception', expectedException.getMessage(), 'Exception message should match expected message');
    }
    
    
    
    @isTest
    static void recruitmentOwnerMetadataTest(){

    Test.startTest();
    ExpenseController.RecruitmentOwnerMetadata();
    Test.StopTest();

    // Asserts Metadata should be retrieved
    System.assertNotEquals(null, ExpenseController.RecruitmentOwnerMetadata(), 'Metadata should be retrieved');

    }

    @isTest
    static void employeeOwnerMetadataTest(){

    Test.startTest();
    ExpenseController.EmployeeOwnerMetadata();
    Test.StopTest();

    // Asserts Metadata should be retrieved
    System.assertNotEquals(null, ExpenseController.EmployeeOwnerMetadata(), 'Metadata should be retrieved');

    }

    @isTest
    static void recordTypeMetadataTest(){

    Test.startTest();
    ExpenseController.RecordTypeMetadata();
    Test.StopTest();

    // Asserts Metadata should be retrieved
    System.assertNotEquals(null, ExpenseController.RecordTypeMetadata(), 'Metadata should be retrieved');

    }

    @isTest
    static void getRecruitmentAdministrationSubcategoryIdTest(){

    Test.startTest();
    ExpenseController.getRecruitmentAdministrationSubcategoryId();
    Test.StopTest();

    // Asserts Metadata should be retrieved
    System.assertNotEquals(null, ExpenseController.getRecruitmentAdministrationSubcategoryId(), 'Metadata should be retrieved');
    }

    @isTest
    static void getEmployeeAdministrationSubcategoryIdTest(){

    Test.startTest();
    ExpenseController.getEmployeeAdministrationSubcategoryId();
    Test.StopTest();

    // Asserts Metadata should be retrieved
    System.assertNotEquals(null, ExpenseController.getEmployeeAdministrationSubcategoryId(), 'Metadata should be retrieved');
    }

    @isTest
    static void testGetBudget() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.today();
        System.debug('Subcategory: ' + Subcategory);
        System.debug('transactionDate: ' + transactionDate);
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    // Test getBudget but in this case with a null value for the Subcategory__c field
    @isTest
    static void testGetBudgetError() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = null;
        Date transactionDate = Date.today();
        System.debug('Subcategory: ' + Subcategory);
        System.debug('transactionDate: ' + transactionDate);

        Exception expectedException;
        Test.startTest();
        try {
            // This should cause an exception to be thrown
            Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        } catch (AuraHandledException e) {
            expectedException = e;
        }
        Test.stopTest();
    
        // Assert that an exception was thrown
        System.assertNotEquals(null, expectedException, 'An exception should have been thrown');
        System.assertEquals('Script-thrown exception', expectedException.getMessage(), 'Exception message should match expected message');
        
    }


    @isTest
    static void testGetBudgetAugustMonth() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.newInstance(2023, 8, 1);
        System.debug('Subcategory: ' + Subcategory);
        System.debug('transactionDate: ' + transactionDate);
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    @isTest
    static void testGetBudgetSeptemberMonth() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.newInstance(2023, 9, 1);
        System.debug('Subcategory: ' + Subcategory);
        System.debug('transactionDate: ' + transactionDate);
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    @isTest
    static void testGetBudgetOctoberMonth() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.newInstance(2023, 10, 1);

        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    @isTest
    static void testGetBudgetNovemberMonth() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.newInstance(2023, 11, 1);
        
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    @isTest
    static void testGetBudgetDecemberMonth() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing' LIMIT 1];
        String subcategory = SubcategoryId.Id;
        Date transactionDate = Date.newInstance(2023, 12, 1);
        
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // The Assert should return a Budget__c record
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }


    @isTest
    static void testGetCategory() {
    
    Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Name = 'Fabi Team Building' LIMIT 1];
    String subcategory = subcategoryId.Id;

    Test.startTest();
     String result = ExpenseController.getCategory(subcategory);
    Test.stopTest();

    // The Assert should return a Subcategory__c record
    System.assertNotEquals(null, result, 'Category should be retrieved');
    }


    @isTest
    static void testGetExpenses() {
        // Prepare data
        Credit_Card_Amount__c statement = [SELECT Id FROM Credit_Card_Amount__c LIMIT 1];
        String statementId = statement.Id;
        
        Test.startTest();
        List<ExpenseController.ExpenseWrapper> result = ExpenseController.getExpenses(statementId);
        Test.stopTest();
        
        // Asserts
        System.assertNotEquals(null, result, 'Expenses should be retrieved');
        System.assertNotEquals(0, result.size(), 'Should have retrieved some expenses');
    }

    @isTest
    static void testDeleteExpense() {
        // Prepare data
        List<Expense__c> expenses = [SELECT Id FROM Expense__c];
    
        // If no records are found, do not proceed with the test
        if (expenses.isEmpty()) {
            System.assert(false, 'No expense record found for testing');
            return;
        }
    
        Expense__c expense = expenses[0];
        String expenseId = expense.Id;
    
        System.debug('expenseId: ' + expense.Id);
    
        Test.startTest();
        // Call the method to delete the expense
        ExpenseController.deleteExpense(expenseId);
        Test.stopTest();
        
        // Asserts
        // Attempt to query the deleted expense
        List<Expense__c> result = [SELECT Id FROM Expense__c WHERE Id = :expenseId];
        // If the delete was successful, the result list should be empty
        System.assertEquals(true, result.isEmpty(), 'Expense should be deleted');
    }
    
    @isTest
    static void testDeleteExpenseError() {
        // Prepare data
        String expenseId = 'AAFSSDFSDFSDFSDFSDFSDFS'; // Use null Id to cause the delete operation to fail
    
        Test.startTest();
            ExpenseController.deleteExpense(expenseId);
            // Assert that the exception message is what we expected
        Test.stopTest();
    } 
    

    @isTest
    static void testGetTeamMembers() {
        // Prepare data
        Subcategory__c subcategoryId = [SELECT Id FROM Subcategory__c WHERE Name = 'Fabi Team Building' LIMIT 1];
        String subcategory = subcategoryId.Id;
        System.debug('Subcategory: ' + Subcategory);
        Test.startTest();
        List<Team_Member__c> result = ExpenseController.getTeamMembers(subcategory);
        Test.stopTest();
        
        // Asserts
        System.assertNotEquals(null, result, 'Team members should be retrieved');
        System.assertNotEquals(0, result.size(), 'Should have retrieved some team members');
    }

    @isTest
    static void testCreateExpenseWithTeamMembers() {
        // Prepare data
        List<Expense__c> expenses = [SELECT Id FROM Expense__c];
        List<Team_Member__c> teamMembers = [SELECT Id FROM Team_Member__c];
    
    
        Expense__c expense = expenses[0];
        String expenseId = expense.Id;
        List<String> teamMemberIds = new List<String>{}; // replace with appropriate test values
        // for every team member found, add the Id to the teamMemberIds list
        for (Team_Member__c teamMember : teamMembers) {
            teamMemberIds.add(teamMember.Id);
        }
        
        Test.startTest();
        ExpenseController.createExpenseWithTeamMembers(expenseId, teamMemberIds);
        Test.stopTest();
        
        // Asserts
        // Check that the Expense_with_Team_Member__c records have been created
        List<Expense_with_Team_Member__c> teamMemberExpenses = [SELECT Id, Expense__c, Team_Member__c FROM Expense_with_Team_Member__c WHERE Expense__c = :expenseId];
        System.assertNotEquals(0, teamMemberExpenses.size(), 'Expense_with_Team_Member__c records should be created');
    }
}