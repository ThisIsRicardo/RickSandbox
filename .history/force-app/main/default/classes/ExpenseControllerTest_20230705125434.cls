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

        Budget__c recruitmentJanuaryBudget = new Budget__c();
        recruitmentJanuaryBudget.Name = 'Fabi Team Building January 2023';
        recruitmentJanuaryBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJanuaryBudget.Month__c = 'January';
        recruitmentJanuaryBudget.Monthly_Amount__c = 7500;
        insert recruitmentJanuaryBudget;

        Budget__c recruitmentFebruaryBudget = new Budget__c();
        recruitmentFebruaryBudget.Name = 'Fabi Team Building February 2023';
        recruitmentFebruaryBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentFebruaryBudget.Month__c = 'February';
        recruitmentFebruaryBudget.Monthly_Amount__c = 7500;
        insert recruitmentFebruaryBudget;

        Budget__c recruitmentMarchBudget = new Budget__c();
        recruitmentMarchBudget.Name = 'Fabi Team Building March 2023';
        recruitmentMarchBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentMarchBudget.Month__c = 'March';
        recruitmentMarchBudget.Monthly_Amount__c = 7500;
        insert recruitmentMarchBudget;

        Budget__c recruitmentAprilBudget = new Budget__c();
        recruitmentAprilBudget.Name = 'Fabi Team Building April 2023';
        recruitmentAprilBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentAprilBudget.Month__c = 'April';
        recruitmentAprilBudget.Monthly_Amount__c = 7500;
        insert recruitmentAprilBudget;

        Budget__c recruitmentMayBudget = new Budget__c();
        recruitmentMayBudget.Name = 'Fabi Team Building May 2023';
        recruitmentMayBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentMayBudget.Month__c = 'May';
        recruitmentMayBudget.Monthly_Amount__c = 7500;
        insert recruitmentMayBudget;

        Budget__c recruitmentJuneBudget = new Budget__c();
        recruitmentJuneBudget.Name = 'Fabi Team Building June 2023';
        recruitmentJuneBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJuneBudget.Month__c = 'June';
        recruitmentJuneBudget.Monthly_Amount__c = 7500;
        insert recruitmentJuneBudget;

        Budget__c recruitmentJulyBudget = new Budget__c();
        recruitmentJulyBudget.Name = 'Fabi Team Building July 2023';
        recruitmentJulyBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJulyBudget.Month__c = 'July';
        recruitmentJulyBudget.Monthly_Amount__c = 7500;
        insert recruitmentJulyBudget;

        Budget__c recruitmentAugustBudget = new Budget__c();
        recruitmentAugustBudget.Name = 'Fabi Team Building August 2023';
        recruitmentAugustBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentAugustBudget.Month__c = 'August';
        recruitmentAugustBudget.Monthly_Amount__c = 7500;
        insert recruitmentAugustBudget;

        Budget__c recruitmentSeptemberBudget = new Budget__c();
        recruitmentSeptemberBudget.Name = 'Fabi Team Building September 2023';
        recruitmentSeptemberBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentSeptemberBudget.Month__c = 'September';
        recruitmentSeptemberBudget.Monthly_Amount__c = 7500;
        insert recruitmentSeptemberBudget;

        Budget__c recruitmentOctoberBudget = new Budget__c();
        recruitmentOctoberBudget.Name = 'Fabi Team Building October 2023';
        recruitmentOctoberBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentOctoberBudget.Month__c = 'October';
        recruitmentOctoberBudget.Monthly_Amount__c = 7500;
        insert recruitmentOctoberBudget;

        Budget__c recruitmentNovemberBudget = new Budget__c();
        recruitmentNovemberBudget.Name = 'Fabi Team Building November 2023';
        recruitmentNovemberBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentNovemberBudget.Month__c = 'November';
        recruitmentNovemberBudget.Monthly_Amount__c = 7500;
        insert recruitmentNovemberBudget;

        Budget__c recruitmentDecemberBudget = new Budget__c();
        recruitmentDecemberBudget.Name = 'Fabi Team Building December 2023';
        recruitmentDecemberBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentDecemberBudget.Month__c = 'December';
        recruitmentDecemberBudget.Monthly_Amount__c = 7500;
        insert recruitmentDecemberBudget;
        

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

        Budget__c employeeJanuaryBudget = new Budget__c();
        employeeJanuaryBudget.Name = 'Morena Team Building January 2023';
        employeeJanuaryBudget.Subcategory__c = employeeSubcategory.Id;
        employeeJanuaryBudget.Month__c = 'January';
        employeeJanuaryBudget.Monthly_Amount__c = 7500;
        insert employeeJanuaryBudget;

        Budget__c employeeFebruaryBudget = new Budget__c();
        employeeFebruaryBudget.Name = 'Morena Team Building February 2023';
        employeeFebruaryBudget.Subcategory__c = employeeSubcategory.Id;
        employeeFebruaryBudget.Month__c = 'February';
        employeeFebruaryBudget.Monthly_Amount__c = 7500;
        insert employeeFebruaryBudget;

        Budget__c employeeMarchBudget = new Budget__c();
        employeeMarchBudget.Name = 'Morena Team Building March 2023';
        employeeMarchBudget.Subcategory__c = employeeSubcategory.Id;
        employeeMarchBudget.Month__c = 'March';
        employeeMarchBudget.Monthly_Amount__c = 7500;
        insert employeeMarchBudget;

        Budget__c employeeAprilBudget = new Budget__c();
        employeeAprilBudget.Name = 'Morena Team Building April 2023';
        employeeAprilBudget.Subcategory__c = employeeSubcategory.Id;
        employeeAprilBudget.Month__c = 'April';
        employeeAprilBudget.Monthly_Amount__c = 7500;
        insert employeeAprilBudget;

        Budget__c employeeMayBudget = new Budget__c();
        employeeMayBudget.Name = 'Morena Team Building May 2023';
        employeeMayBudget.Subcategory__c = employeeSubcategory.Id;
        employeeMayBudget.Month__c = 'May';
        employeeMayBudget.Monthly_Amount__c = 7500;
        insert employeeMayBudget;

        Budget__c employeeJuneBudget = new Budget__c();
        employeeJuneBudget.Name = 'Morena Team Building June 2023';
        employeeJuneBudget.Subcategory__c = employeeSubcategory.Id;
        employeeJuneBudget.Month__c = 'June';
        employeeJuneBudget.Monthly_Amount__c = 7500;
        insert employeeJuneBudget;

        Budget__c employeeJulyBudget = new Budget__c();
        employeeJulyBudget.Name = 'Morena Team Building July 2023';
        employeeJulyBudget.Subcategory__c = employeeSubcategory.Id;
        employeeJulyBudget.Month__c = 'July';
        employeeJulyBudget.Monthly_Amount__c = 7500;
        insert employeeJulyBudget;

        Budget__c employeeAugustBudget = new Budget__c();
        employeeAugustBudget.Name = 'Morena Team Building August 2023';
        employeeAugustBudget.Subcategory__c = employeeSubcategory.Id;
        employeeAugustBudget.Month__c = 'August';
        employeeAugustBudget.Monthly_Amount__c = 7500;
        insert employeeAugustBudget;

        Budget__c employeeSeptemberBudget = new Budget__c();
        employeeSeptemberBudget.Name = 'Morena Team Building September 2023';
        employeeSeptemberBudget.Subcategory__c = employeeSubcategory.Id;
        employeeSeptemberBudget.Month__c = 'September'; 
        employeeSeptemberBudget.Monthly_Amount__c = 7500;
        insert employeeSeptemberBudget;

        Budget__c employeeOctoberBudget = new Budget__c();
        employeeOctoberBudget.Name = 'Morena Team Building October 2023';
        employeeOctoberBudget.Subcategory__c = employeeSubcategory.Id;
        employeeOctoberBudget.Month__c = 'October';
        employeeOctoberBudget.Monthly_Amount__c = 7500;
        insert employeeOctoberBudget;

        Budget__c employeeNovemberBudget = new Budget__c();
        employeeNovemberBudget.Name = 'Morena Team Building November 2023';
        employeeNovemberBudget.Subcategory__c = employeeSubcategory.Id;
        employeeNovemberBudget.Month__c = 'November';
        employeeNovemberBudget.Monthly_Amount__c = 7500;
        insert employeeNovemberBudget;

        Budget__c employeeDecemberBudget = new Budget__c();
        employeeDecemberBudget.Name = 'Morena Team Building December 2023';
        employeeDecemberBudget.Subcategory__c = employeeSubcategory.Id;
        employeeDecemberBudget.Month__c = 'December';
        employeeDecemberBudget.Monthly_Amount__c = 7500;
        insert employeeDecemberBudget;
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
static void testSaveExpenses_Error() {
    // Create an Expense__c object without required fields.
    Expense__c testExpense = new Expense__c();
    testExpense.Name = 'testExpense';

    Test.startTest();
    // This should cause an exception to be thrown
        Expense__c result = ExpenseController.saveExpenses(testExpense);
    Test.stopTest();
}



    @isTest
    static void testGetBudget() {
        // Prepare data
        String subcategory = 'testSubCategory'; // replace with appropriate test value
        Date transactionDate = Date.today();
        
        Test.startTest();
        Budget__c result = ExpenseController.getBudget(subcategory, transactionDate);
        Test.stopTest();
        
        // Asserts
        System.assertNotEquals(null, result, 'Budget should be retrieved');
    }

    @isTest
    static void testGetExpenses() {
        // Prepare data
        String statementId = 'testStatementId'; // replace with appropriate test value
        
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
        String expenseId = 'testExpenseId'; // replace with appropriate test value
        
        Test.startTest();
        ExpenseController.deleteExpense(expenseId);
        Test.stopTest();
        
        // Asserts
        // Check that the expense has been deleted
        Expense__c deletedExpense = [SELECT Id FROM Expense__c WHERE Id = :expenseId];
        System.assertEquals(null, deletedExpense, 'Expense should be deleted');
    }

    @isTest
    static void testCreateExpenseWithTeamMembers() {
        // Prepare data
        String expenseId = 'testExpenseId'; // replace with appropriate test value
        List<String> teamMemberIds = new List<String>{'testTeamMemberId1', 'testTeamMemberId2'}; // replace with appropriate test values
        
        Test.startTest();
        ExpenseController.createExpenseWithTeamMembers(expenseId, teamMemberIds);
        Test.stopTest();
        
        // Asserts
        // Check that the Expense_with_Team_Member__c records have been created
        List<Expense_with_Team_Member__c> teamMemberExpenses = [SELECT Id, Expense__c, Team_Member__c FROM Expense_with_Team_Member__c WHERE Expense__c = :expenseId];
        System.assertNotEquals(0, teamMemberExpenses.size(), 'Expense_with_Team_Member__c records should be created');
    }
}