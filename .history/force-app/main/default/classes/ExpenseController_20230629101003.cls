// ExpenseController.cls
public with sharing class ExpenseController {
    @AuraEnabled
    public static void saveExpenses(Expense__c expense) {
        try {
            insert expense;
        } catch (Exception e) {
            throw new AuraHandledException('Could not save expense: ' + e.getMessage());
        }
    }



    // ExpenseController.cls
    @AuraEnabled
    public static Budget__c getBudget(String subcategory, Date transactionDate) {
        // Convert the month and year to strings
        String monthAsString;
        switch on transactionDate.month() {
            when 1 { monthAsString = 'January'; }
            when 2 { monthAsString = 'February'; }
            when 3 { monthAsString = 'March'; }
            when 4 { monthAsString = 'April'; }
            when 5 { monthAsString = 'May'; }
            when 6 { monthAsString = 'June'; }
            when 7 { monthAsString = 'July'; }
            when 8 { monthAsString = 'August'; }
            when 9 { monthAsString = 'September'; }
            when 10 { monthAsString = 'October'; }
            when 11 { monthAsString = 'November'; }
            when 12 { monthAsString = 'December'; }
        }
        String yearAsString = String.valueOf(transactionDate.year());
    
        // Query for the budget
        List<Budget__c> budgets = [
            SELECT Id, Name, Available_Amount__c 
            FROM Budget__c 
            WHERE Subcategory__c = :subcategory 
            AND Month__c = :monthAsString
            AND Year__c = :yearAsString
            LIMIT 1
        ];
        
        // Throw an exception if no matching budget was found
        if (budgets.isEmpty()) {
            throw new AuraHandledException('No matching budget found for subcategory and transaction date: ' + subcategory + ', ' + transactionDate);
        }
        
        return budgets[0];
    }

    @AuraEnabled
    public static string RecruitmentOwnerMetadata(){
        
        Expense_Record_Owner__mdt recruitmentOwnerID = [
            SELECT Owner_ID__c
            FROM Expense_Record_Owner__mdt
            WHERE MasterLabel = 'Recruitment Owner ID'
        ];
        return recruitmentOwnerID.Owner_ID__c;
        
    }

    @AuraEnabled
    public static string EmployeeOwnerMetadata(){
        
        Expense_Record_Owner__mdt employeeOwnerID = [
            SELECT Owner_ID__c
            FROM Expense_Record_Owner__mdt
            WHERE MasterLabel = 'Employee Owner ID'
        ];
        return employeeOwnerID.Owner_ID__c;
    }

    @AuraEnabled
    public static Map<String, String> RecordTypeMetadata() {
        Expenses_and_Budgets_Parameters__mdt recordTypeId = [
            SELECT 	Recruitment_Record_Type_ID__c, Employee_Record_Type_ID__c
            FROM Expenses_and_Budgets_Parameters__mdt
            WHERE MasterLabel = 'Recruitment Parameters'
        ];
        Map<String, String> recordTypeMap = new Map<String, String>();
        recordTypeMap.put('Recruitment, Trainees and Marketing', recordTypeId.Recruitment_Record_Type_ID__c);
        recordTypeMap.put('Employee Experience and Development', recordTypeId.Employee_Record_Type_ID__c);
        return recordTypeMap;
    }

    @AuraEnabled
    public static String getCategory(String subcategoryId) {
    Subcategory__c subcategory = [SELECT Category__c FROM Subcategory__c WHERE Id = :subcategoryId];
    return subcategory.Category__c;
    }

    @AuraEnabled
    public static List<Team_Member__c> getTeamMembers(String subcategory) {
    // You'll need to adjust this SOQL query based on your actual field and object names
    Subcategory__c subcategoryCostCenter = [SELECT Category__c FROM Subcategory__c WHERE Id = :subcategory];
    return [
        SELECT Id, Name, Cost_Item__c FROM Team_Member__c 
        WHERE Cost_item__c = :subcategoryCostCenter.Category__c
    ];
    
}

    @AuraEnabled(cacheable=true)
    public static List<Subcategory__c> getCategoryOptions(String recordType) {
        // Add your filtering logic here
        return [SELECT Id, Name FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing'];

    }


    @AuraEnabled(cacheable=true)
    // We need to retrive all the expenses that are related to a the Credit_Card_Amount__c object that is passed in the Credit_Card_Statement__c field 
    public static List<Expense__c> getExpenses(String statementId) {
        try {
            System.debug('statementId: ' + statementId + );
            return [SELECT Id, Transaction_Date__c, Name, Subcategory__c, Amount_Spent__c, Associated_Credit_Card__c, Credit_Card_Statement__c,
            License__c, Course__c, Receipt_Type__c, Stage__c  FROM Expense__c WHERE Credit_Card_Statement__c = :statementId ORDER BY Transaction_Date__c ASC LIMIT 200];
            System.debug('statementId: ' + statementId);
        } catch (Exception e) {
            throw new AuraHandledException('Could not fetch expenses: ' + e.getMessage());
        }
    }

}
   


