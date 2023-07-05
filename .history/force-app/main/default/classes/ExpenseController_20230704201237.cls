// ExpenseController.cls
public with sharing class ExpenseController {


    public class ExpenseWrapper {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Decimal amountSpent;
        @AuraEnabled 
        public String stage;
        @auraEnabled
        public Date transactionDate;
        // Continue with other fields...
        @AuraEnabled
        public String associatedTeamMemberName;
        @AuraEnabled
        public String associatedCreditCardName;
        @AuraEnabled
        public String creditCardStatementName;
        @AuraEnabled
        public String subcategoryName;
        @AuraEnabled
        public String licenseName;
        @AuraEnabled
        public String courseName;
        @AuraEnabled
        public String budgetCategory;

        @AuraEnabled
        public String subcategoryId;
        // ...Continue for other fields
    }


    @AuraEnabled
    public static Expense__c saveExpenses(Expense__c expense) {
        try {
            insert expense;
            return expense;
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

    @AuraEnabled(cacheable=false)
    public static String getRecruitmentAdministrationSubcategoryId() {
    Expenses_and_Budgets_Parameters__mdt recruitmentMetadataRecord = [
        SELECT Administration_Subcategory_ID__c
        FROM Expenses_and_Budgets_Parameters__mdt
        WHERE MasterLabel = 'Recruitment Parameters'
    ];
    
    // Make sure the record exists and the field value is not null
    if (recruitmentMetadataRecord != null && recruitmentMetadataRecord.Administration_Subcategory_ID__c != null) {
        return recruitmentMetadataRecord.Administration_Subcategory_ID__c;
    } else {
        return null;
    }
}

@AuraEnabled(cacheable=false)
public static String getEmployeeAdministrationSubcategoryId() {
Expenses_and_Budgets_Parameters__mdt employeeMetadataRecord = [
    SELECT Administration_Subcategory_ID__c
    FROM Expenses_and_Budgets_Parameters__mdt
    WHERE MasterLabel = 'Employee Parameters'
];

// Make sure the record exists and the field value is not null
if (employeeMetadataRecord != null && employeeMetadataRecord.Administration_Subcategory_ID__c != null) {
    return employeeMetadataRecord.Administration_Subcategory_ID__c;
} else {
    return null;
}
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


    @AuraEnabled(cacheable=false)
    public static List<ExpenseWrapper> getExpenses(String statementId) {
        List<ExpenseWrapper> wrappers = new List<ExpenseWrapper>();
        for (Expense__c expense : [
            SELECT Id, Name, Amount_Spent__c, Transaction_Date__c, Associated_Credit_Card__r.Name , Receipt_Type__c, Credit_Card_Statement__r.Name, Associated_Team_Member__r.Name, Submit_for_Approval__c, Subcategory__r.Name, Subcategory__r.Id, License__r.Name, Course__r.Name, Budget_Category__c, Stage__c
            FROM Expense__c
            WHERE Credit_Card_Statement__c = :statementId
            ORDER BY CreatedDate ASC
        ]) {
            ExpenseWrapper wrapper = new ExpenseWrapper();
            wrapper.id = expense.Id;
            wrapper.name = expense.Name;
            wrapper.amountSpent = expense.Amount_Spent__c;
            wrapper.transactionDate = expense.Transaction_Date__c;
            wrapper.stage = expense.Stage__c;
            wrapper.budgetCategory = expense.Budget_Category__c;
            wrapper.subcategoryId = expense.Subcategory__r.Id
            // Other fields...
            wrapper.associatedTeamMemberName = expense.Associated_Team_Member__r != null ? expense.Associated_Team_Member__r.Name : '';
            wrapper.associatedCreditCardName = expense.Associated_Credit_Card__r != null ? expense.Associated_Credit_Card__r.Name : '';
            wrapper.creditCardStatementName = expense.Credit_Card_Statement__r != null ? expense.Credit_Card_Statement__r.Name : '';
            wrapper.subcategoryName = expense.Subcategory__r != null ? expense.Subcategory__r.Name : '';
            wrapper.licenseName = expense.License__r != null ? expense.License__r.Name : '';
            wrapper.courseName = expense.Course__r != null ? expense.Course__r.Name : '';
            // ...Continue for other fields
            wrappers.add(wrapper);
        }
        return wrappers;
    }


    @AuraEnabled(cacheable=false)
public static void deleteExpense(String expenseId) {
    try {
        // Deleting the expense
        delete [SELECT Id FROM Expense__c WHERE Id = :expenseId];
    } catch (Exception e) {
        throw new AuraHandledException('Could not delete the expense: ' + e.getMessage());
    }
}

@AuraEnabled
    public static void createExpenseWithTeamMembers(String expenseId, List<String> teamMemberIds) {
        System.debug('expenseId: ' + expenseId);
        System.debug('teamMemberIds: ' + teamMemberIds);
        List<Expense_with_Team_Member__c> expenseWithTeamMembers = new List<Expense_with_Team_Member__c>();
        for (String teamMemberId : teamMemberIds) {
            Expense_with_Team_Member__c newRecord = new Expense_with_Team_Member__c(
                Expense__c = expenseId,
                Team_Member__c = teamMemberId
            );
            expenseWithTeamMembers.add(newRecord);
        }
        insert expenseWithTeamMembers;
    }

}
   


