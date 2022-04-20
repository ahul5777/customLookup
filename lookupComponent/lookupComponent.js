import { api, LightningElement, track, wire  } from 'lwc';
import lookUp from '@salesforce/apex/Lookup.search';
export default class LookupComponent extends LightningElement {
    @api objName;
    @api iconName;
    
    @api searchPlaceholder='Search';

    @track selectedName;
    @track records;
    @track  isValueSelected;
    @track blurTimeout;

    @api bank;

    searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    @wire(lookUp, {searchTerm : '$searchTerm', myObject : '$objName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    
    connectedCallback()
    {

        //chcking if parent already has value for his lookup and displaying that
        if(this.bank)
        {
            this.selectedName=this.bank;
            this.isValueSelected=true;
        }
    }


    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail:  selectedId });
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    handleRemovePill(event) {
      
        this.isValueSelected = false;
        let selectedName = event.currentTarget.dataset.name;
        console.log('Name of removed: '+event.currentTarget.dataset.name);

    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }
}