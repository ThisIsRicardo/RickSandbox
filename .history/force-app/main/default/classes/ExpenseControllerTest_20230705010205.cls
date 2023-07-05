@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setup() {
        Account a = new Account(Name = 'Test Account');
        insert a;
        Contact c = new Contact(LastName = 'Test Contact', AccountId = a.Id);
        insert c;
        Expense__c e = new Expense__c(Name = 'Test Expense', Contact__c = c.Id, Amount__c = 100);
        insert e;
    }
}