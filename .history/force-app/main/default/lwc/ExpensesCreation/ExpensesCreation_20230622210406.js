// expenseGrid.js
import { LightningElement, track, wire } from 'lwc'
import saveExpenses from '@salesforce/apex/ExpenseController.saveExpenses'
import RecruitmentOwnerMetadata from '@salesforce/apex/ExpenseController.RecruitmentOwnerMetadata'
import EmployeeOwnerMetadata from '@salesforce/apex/ExpenseController.EmployeeOwnerMetadata'
import RecordTypeMetadata from '@salesforce/apex/ExpenseController.RecordTypeMetadata'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi'
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c'
import RECEIPT_TYPE_FIELD from '@salesforce/schema/Expense__c.Receipt_Type__c'
import getBudget from '@salesforce/apex/ExpenseController.getBudget'
import LightningAlert from 'lightning/alert'
import getCategory from '@salesforce/apex/ExpenseController.getCategory'
import getTeamMembers from '@salesforce/apex/ExpenseController.getTeamMembers'

export default class ExpenseCreation extends LightningElement {
  @track transactions = [];
  @track isSelectedRows = false;
  @track creditCardStatement = '';
  @track selectedSubcategory = '';
  @track teamMembers = [];
  @track recordTypeId;
  @track receiptTypeValues = [];
  @track recordTypeMap;
  @track isModalOpen = false;
  @track selectedTeamMembers = [];
  @track currentExpenseIndex = null;
  @track isMultipleTeamMembersAdded = false;
  @track value = '';

  @wire(getPicklistValues, {
    recordTypeId: '$recordTypeId',
    fieldApiName: RECEIPT_TYPE_FIELD
  })
  wiredPicklistValues({ error, data }) {
    if (data) {
      this.receiptTypeValues = data.values
      this.error = undefined
    } else if (error) {
      this.error = error
      this.receiptTypeValues = undefined
    }
  }

  get isLicenseOrEventVisible() {
    return this.isLicenseVisible || this.isEventVisible;
  }

  async connectedCallback() {
    await RecordTypeMetadata()
      .then(result => {
        this.recordTypeId = result['Recruitment, Trainees and Marketing']
      })
      .catch(error => {
        console.error('Error in fetchRecordTypeMetadata:', error)
      })

    await RecruitmentOwnerMetadata()
      .then(result => {
        console.log('Result from fetchRecruitmentOwnerMetadata:', result)
        this.recruitmentOwnerMetadata = result
      })
      .catch(error => {
        console.error('Error in fetchRecruitmentOwnerMetadata:', error)
      })

    await EmployeeOwnerMetadata()
      .then(result => {
        console.log('Result from fetchEmployeeOwnerMetadata:', result)
        this.employeeOwnerMetadata = result
      })
      .catch(error => {
        console.error('Error in fetchEmployeeOwnerMetadata:', error)
      })

    await RecordTypeMetadata()
      .then(result => {
        this.recordTypeMap = result
      })
      .catch(error => {
        console.error('Error in fetchRecordTypeMetadata:', error)
      })
  }

  handleTransactionTypeChange(event) {
    this.transactionType = event.detail.value;
    this.isOtherExpenseSelected = false;
    if (this.transactionType === 'Other Expense') {
      this.isOtherExpenseSelected = true;
    }
  }

  handleOtherExpenseTypeChange(event) {
    this.otherExpenseType = event.detail.value;
  }

  handleNextClick() {
    if (!this.creditCardStatement) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please, Select a Credit Card Statement before proceeding.',
          variant: 'warning'
        })
      );
      return;
    }

    this.isTransactionCardVisible = false;
    this.isExpenseCardVisible = true;
    switch (this.transactionType) {
      case 'License':
        this.isTeamMemberVisible = false;
        this.isEventVisible = false;
        this.isTeamMemberIconVisible = false;
        break;
      case 'Event':
        this.isTeamMemberVisible = false;
        this.isLicenseVisible = false;
        this.isTeamMemberIconVisible = false;
        break;
      case 'Other Expense':
        if (!this.creditCardStatement) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Warning',
              message: 'Please, Select a Credit Card Statement before proceeding.',
              variant: 'warning'
            })
          );
          return;
        }
        switch (this.otherExpenseType) {
          case 'One':
            this.isTeamMemberVisible = true;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            break;
          case 'Multiple Team Members':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = true;
            break;
          case 'None':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            break;
          default:
            this.isExpenseCardVisible = false;
            this.isTransactionCardVisible = true;
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Selection Error',
                message: 'Please, select how many team members the expense will have.',
                variant: 'warning'
              })
            )
        }
        break;
      default:
        this.isExpenseCardVisible = false;
        this.isTransactionCardVisible = true;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Selection Error',
            message: 'Please, select a transaction type.',
            variant: 'warning'
          })
        )
    }
  }

  handleDateChange(event) {
    this.transactions[0].Transaction_Date__c = event.target.value;
  }

  handleNameChange(event) {
    this.transactions[0].Name = event.target.value;
  }

  handleSubcategoryChange(event) {
    this.selectedSubcategory = event.target.value;
    getCategory({ subcategoryId: event.target.value })
      .then(category => {
        if (category === 'Recruitment, Trainees and Marketing') {
          this.transactions[0].RecordTypeId =
            this.recordTypeMap['Recruitment, Trainees and Marketing'];
          this.transactions[0].OwnerId = this.recruitmentOwnerMetadata;
        } else if (category === 'Employee Experience and Development') {
          this.transactions[0].RecordTypeId =
            this.recordTypeMap['Employee Experience and Development'];
          this.transactions[0].OwnerId = this.employeeOwnerMetadata;
        }
      })
      .catch(error => {
        console.error('Error fetching category:', error)
      })
  }

  handleAmountChange(event) {
    this.transactions[0].Amount_Spent__c = event.target.value;
  }

  handleCreditCardChange(event) {
    this.transactions[0].Associated_Credit_Card__c = event.target.value;
  }

  handleCreditCardStatementChange(event) {
    if (Array.isArray(event.detail.value) && event.detail.value.length > 0) {
      this.creditCardStatement = event.detail.value[0];
    } else {
      this.creditCardStatement = event.detail.value;
    }
    this.updateTransactionsWithCreditCardStatement();
  }

  updateTransactionsWithCreditCardStatement() {
    this.transactions[0].Credit_Card_Statement__c = this.creditCardStatement;
  }

  handleTeamMemberChange(event) {
    this.transactions[0].Associated_Team_Member__c = event.target.value;
  }

  handleLicenseChange(event) {
    this.transactions[0].License__c = event.target.value;
  }

  handleEventChange(event) {
    this.transactions[0].Course__c = event.target.value;
  }

  handleReceiptTypeChange(event) {
    this.transactions[0].Receipt_Type__c = event.detail.value;
  }

  handlePaymentMethodChange(event) {
    this.transactions[0].Payment_Method__c = event.target.value;
  }

  handleSaveExpenses() {
    let allValid = true;
    const expense = this.transactions[0];

    if (
      !expense.Name ||
      !expense.Transaction_Date__c ||
      !expense.Amount_Spent__c ||
      !expense.Associated_Credit_Card__c
    ) {
      allValid = false;
    }

    if (!allValid) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please fill out the required fields before saving.',
          variant: 'warning'
        })
      );
      return;
    }

    saveExpenses({ expenses: this.transactions })
      .then(result => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Expenses saved successfully',
            variant: 'success'
          })
        );
      })
      .catch(error => {
        let message = 'An error occurred while trying to save the expenses.';
        console.log("Expenses to be saved: ", this.transactions);

        if (
          error.body.message.includes(
            'REQUIRED_FIELD_MISSING, Required fields are missing: [Subcategory]'
          )
        ) {
          message =
            'Please make sure to fill out the Subcategory field before saving.';
        }
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error saving expenses',
            message: message,
            variant: 'error'
          })
        );
      });
  }

  handleDeleteRow(event) {
    this.transactions = [];
  }

  handleOpenNewExpense() {
    this.transactions = [];
    this.isTransactionTypeModalOpen = true;
  }

  handleAddExpense() {
    // Create a new expense with the values from the form
    const newExpense = {
      Transaction_Date__c: this.transactions[0].Transaction_Date__c,
      Name: this.transactions[0].Name,
      Subcategory__c: this.transactions[0].Subcategory__c,
      Amount_Spent__c: this.transactions[0].Amount_Spent__c,
      Associated_Credit_Card__c: this.transactions[0].Associated_Credit_Card__c,
      Associated_Team_Member__c: this.transactions[0].Associated_Team_Member__c,
      License__c: this.transactions[0].License__c,
      Course__c: this.transactions[0].Course__c,
      Receipt_Type__c: this.transactions[0].Receipt_Type__c
    };

    // Add the new expense to the transactions array
    this.transactions = [newExpense];

    // Clear out the form fields by resetting the single item in the `transactions` array
    this.transactions[0] = {
      Transaction_Date__c: '',
      Name: '',
      Subcategory__c: '',
      Amount_Spent__c: '',
      Associated_Credit_Card__c: '',
      Associated_Team_Member__c: '',
      License__c: '',
      Course__c: '',
      Receipt_Type__c: ''
    };
  }
}
