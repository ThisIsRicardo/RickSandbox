// expenseGrid.js
import { LightningElement, track, wire } from 'lwc';
import saveExpenses from '@salesforce/apex/ExpenseController.saveExpenses';
import RecruitmentOwnerMetadata from '@salesforce/apex/ExpenseController.RecruitmentOwnerMetadata';
import EmployeeOwnerMetadata from '@salesforce/apex/ExpenseController.EmployeeOwnerMetadata';
import RecordTypeMetadata from '@salesforce/apex/ExpenseController.RecordTypeMetadata';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c';
import RECEIPT_TYPE_FIELD from '@salesforce/schema/Expense__c.Receipt_Type__c';
import getBudget from '@salesforce/apex/ExpenseController.getBudget';
import LightningAlert from 'lightning/alert';
import getCategory from '@salesforce/apex/ExpenseController.getCategory';
import getTeamMembers from '@salesforce/apex/ExpenseController.getTeamMembers';




export default class ExpenseCreation extends LightningElement {
    @track expenses = [
        {

            Name: '',
            Subcategory__c: '',
            Transaction_Date__c: '',
            Amount_Spent__c: 0,
            Associated_Credit_Card__c: '',
            Receipt_Type__c: '',
            Credit_Card_Statement__c: '',
            Associated_Team_Member__c: '',
            Submit_for_Approval__c: false,
            License__c: '',
        }
    ];

    @track columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        // Add other fields as necessary
    ];
    


    // variable to store team member data
    @track selectedSubcategory = '';
    @track teamMembers = [];
    @track recordTypeId;
    @track receiptTypeValues = [];
    @track recordTypeMap;
    @track isModalOpen = false;

    openModal() {
    this.isModalOpen = true;
}

    closeModal() {
    this.isModalOpen = false;
}

@wire(getTeamMembers, { subcategory: '$selectedSubcategory' })
wiredTeamMembers({ error, data }) {
    if (data) {
        this.teamMembers = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.teamMembers = [];
    }
}


    @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: RECEIPT_TYPE_FIELD })
    wiredPicklistValues({ error, data }) {
    if (data) {
        this.receiptTypeValues = data.values;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.receiptTypeValues = undefined;
    }
}

    connectedCallback(){
        RecordTypeMetadata()
            .then(result => {
                // result is a map so you can retrieve one of the record type IDs
                this.recordTypeId = result['Recruitment, Trainees and Marketing']; // or another key based on your requirement
            })
            .catch(error => {
                console.error('Error in fetchRecordTypeMetadata:', error);
            });
    
        RecruitmentOwnerMetadata()
            .then(result => {
                console.log('Result from fetchRecruitmentOwnerMetadata:', result);
                this.recruitmentOwnerMetadata = result;
            })
            .catch(error => {
                console.error('Error in fetchRecruitmentOwnerMetadata:', error);
            });
    
        EmployeeOwnerMetadata()
            .then(result => {
                console.log('Result from fetchEmployeeOwnerMetadata:', result);
                this.employeeOwnerMetadata = result;
            })
            .catch(error => {
                console.error('Error in fetchEmployeeOwnerMetadata:', error);
            });

            RecordTypeMetadata()
            .then(result => {
                this.recordTypeMap = result;
            })
            .catch(error => {
                console.error('Error in fetchRecordTypeMetadata:', error);
            });
    }
    

// This is the copy of your data set that will be used for filtering.
@track filteredTeamMembers = [...this.teamMembers];

handleSearch(event) {
  // The search value
  const searchTerm = event.target.value.toLowerCase();

  // Filter your data
  this.filteredTeamMembers = this.teamMembers.filter(teamMember => {
      // Assuming that 'name' is the field you want to search.
      // Adjust this to your data structure.
      return teamMember.name.toLowerCase().includes(searchTerm);
  });

  // Render your table with the filtered data
  this.template.querySelector('lightning-datatable').data = this.filteredTeamMembers;
}


    formatDateAsISOString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JS
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }


    fetchBudget(subcategory, transactionDate, expenseIndex) {
        // If there is no amount in the expense, resolve the promise immediately
        if (!this.expenses[expenseIndex].Amount_Spent__c) {
            this.expenses[expenseIndex].showWarning = false;
            return Promise.resolve();
        }
        
        
        // convert JavaScript date to Apex-friendly string
        let transactionDateObj = new Date(transactionDate);
        transactionDateObj.setHours(0, 0, 0, 0);  // zero out the time portion

        const apexFriendlyDate = this.formatDateAsISOString(transactionDate);
            String(transactionDateObj.getMonth() + 1).padStart(2, '0') + '-' +
            String(transactionDateObj.getDate()).padStart(2, '0');

        return getBudget({ subcategory: subcategory, transactionDate: apexFriendlyDate })
            .then(result => {
                console.log('Result from getBudget:', result);
                return result || null;
            })
            .then(result => {
                console.log('Result from fetchBudget:', result);
                if (result && this.expenses[expenseIndex].Amount_Spent__c > result.Available_Amount__c) {
                    this.expenses[expenseIndex].Submit_for_Approval__c = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Warning',
                            message: `You are exceeding the available amount for this month. The available amount is ${result.Available_Amount__c}. Therefore, the expense will be send to "Pending Approval".`,
                            variant: 'warning',
                        }),
                    );
                } else {
                    this.expenses[expenseIndex].showWarning = false;
                }
                return result;  // Ensure that the result is returned
            })
            .catch(error => {
                console.error('Error in fetchBudget:', error);
            });
    }

    handleAddExpense() {
        const id = this.expenses.length + 1;
        this.expenses.push({ Name: '', Transaction_Date__c: '', Amount_Spent__c: 0, Associated_Credit_Card__c: '', Receipt_Type__c: '', Credit_Card_Statement__c: '', Associated_Team_Member__c: '', License__c: ''});
    }

    handleNameChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Name = event.target.value;
    }

    handleSubcategoryChange(event) {
        this.selectedSubcategory = event.target.value;
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Subcategory__c = event.target.value;
    
        getCategory({ subcategoryId: event.target.value })
            .then(category => {
                if (category === 'Recruitment, Trainees and Marketing') {
                    this.expenses[expenseIndex].RecordTypeId = this.recordTypeMap['Recruitment, Trainees and Marketing'];
                    this.expenses[expenseIndex].OwnerId = this.recruitmentOwnerMetadata;
                } else if (category === 'Employee Experience and Development') {
                    this.expenses[expenseIndex].RecordTypeId = this.recordTypeMap['Employee Experience and Development'];
                    this.expenses[expenseIndex].OwnerId = this.employeeOwnerMetadata;
                }
    
                // Get team members for the selected subcategory
                getTeamMembers({ subcategory: this.selectedSubcategory })
                    .then(result => {
                        this.teamMembers = result;
                    })
                    .catch(error => {
                        console.error('Error fetching team members:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching category:', error);
            });
        }
    

    handleDateChange(event) {
        const index = event.target.dataset.index;
        const transactionDate = event.target.value;
        this.expenses[index].Transaction_Date__c = transactionDate;

        // Fetch the budget if the amount and subcategory are set
        if (this.expenses[index].Amount_Spent__c && this.expenses[index].Subcategory__c) {
            console.log('Calling fetchBudget from handleDateChange');
            this.fetchBudget(this.expenses[index].Subcategory__c, transactionDate, index);
        }
    }

    handleAmountChange(event) {
        const expenseIndex = parseInt(event.target.dataset.index, 10);
        if (isNaN(expenseIndex) || expenseIndex < 0 || expenseIndex >= this.expenses.length) {
            console.error('Invalid expense index:', event.target.dataset.index);
            return;
        }

        const expense = this.expenses[expenseIndex];
        if (!expense) {
            console.error('No expense found at index:', expenseIndex);
            return;
        }

        // Update the expense amount
        expense.Amount_Spent__c = event.target.value;
        this.expenses = [...this.expenses];  // Ensure the change is reactive

        // Ensure date and subcategory are set before fetching budget
        if (!expense.Transaction_Date__c || !expense.Subcategory__c) {
            console.log('Cannot fetch budget, date or subcategory not set.');
            return;
        }

        // Convert the date string to a Date object
        let transactionDate = new Date(expense.Transaction_Date__c);

        console.log('Calling fetchBudget from handleAmountChange');
        // Fetch the Budget record each time Amount_Spent__c changes
        this.fetchBudget(expense.Subcategory__c, transactionDate, expenseIndex)
            .catch(error => {
                // Print the error to the console
                console.error('Error fetching budget: ', error);
            });
    }

    handleCreditCardChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Associated_Credit_Card__c = event.target.value;
    }

    handlePaymentMethodChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Payment_Method__c = event.target.value;
    }

    handleReceiptTypeChange(event) {
        const expenseIndex = this.expenses.findIndex(expense => expense.index === event.target.dataset.index);
        this.expenses[expenseIndex].Receipt_Type__c = event.detail.value;
    }

    handleCreditCardStatementChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Credit_Card_Statement__c = event.target.value;
        console.log('Credit Card Statement Value:', this.expenses[expenseIndex].Credit_Card_Statement__c);
    }

    handleTeamMemberChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].Associated_Team_Member__c = event.target.value;
    }

    handleLicenseChange(event) {
        const expenseIndex = event.target.dataset.index;
        this.expenses[expenseIndex].License__c = event.target.value;
    }

    handleSaveExpenses() {
        let allValid = true;
        this.expenses.forEach((expense) => {
            if (!expense.Name || !expense.Transaction_Date__c || !expense.Amount_Spent__c || !expense.Associated_Credit_Card__c || !expense.Credit_Card_Statement__c) {
                allValid = false;
            }
        });

        if (!allValid) {
            // if some fields are empty, show a warning and stop execution
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning',
                    message: 'Please fill out the required fields before saving.',
                    variant: 'warning',
                })
            );
            return;
        }

        saveExpenses({ expenses: this.expenses })
            .then(result => {
                // Handle successful save
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Expenses saved successfully',
                        variant: 'success',
                    }),
                );
                // Reset the expenses array to the initial state
                this.expenses = [{ Name: '', Transaction_Date__c: '', Amount_Spent__c: 0, Associated_Credit_Card__c: '', Receipt_Type__c: '', Credit_Card_Statement__c: '', Associated_Team_Member__c: '', Submit_for_Approval__c: false, Subcategory__c: '', License__c: '' }];
            })
            .catch(error => {
                // Handle error
                let message = 'An error occurred while trying to save the expenses.';
                if (error.body.message.includes('REQUIRED_FIELD_MISSING, Required fields are missing: [Subcategory]')) {
                    message = 'Please make sure to fill out the Subcategory field before saving.';
                }
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error saving expenses',
                        message: message,
                        variant: 'error',
                    })
                );
            });
    }
}

