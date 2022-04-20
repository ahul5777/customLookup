import { LightningElement,track,api,wire } from 'lwc';
import fetchContacts from '@salesforce/apex/createContacts.fetchContacts';
import saveContacts from '@salesforce/apex/createContacts.saveContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addUpdateContact from '@salesforce/apex/createContacts.addUpdateContact';
export default class BulkContacts extends LightningElement {

    recordId='0015g00000Rx6EaAAJ';

    @track keyIndex=0;

    @track deleteRecords=[];

    error;

    @track contactRecList;

    wiredRecords;

    @track contactRecordId;


    @track showModal=true;

       



   connectedCallback()
   {

   
      this.getData();
            
        
   }


    getData()
    {
        fetchContacts({recordId:this.recordId})
        .then(response=>
         {
             this.contactRecList=JSON.parse(JSON.stringify(response));
             this.error=undefined;
             console.log(this.contactRecList);
               
         })
         .catch(error=>
             {
                 this.error=error;
                 this.contactRecList=undefined;
             })

    }

   addRow()
   {
       this.keyIndex++;
       this.contactRecList.push(
           {
        LastName:' ',
        Bank__c:' ',
        Email:' ',
        Phone:' ',
        AccountId:this.recordId
           }
       )
   }


   changeHandler(event)
   {
       if(event.target.name==='LastName')
       {
          this.contactRecList[event.target.accessKey].LastName=event.target.value;
       }

       else if(event.target.name==='Bank')
       {
          this.contactRecList[event.target.accessKey].Bank__c=event.target.value;
       }

       else if(event.target.name==='Email')
       {
          this.contactRecList[event.target.accessKey].Email=event.target.value;
       }

       else if(event.target.name==='Phone')
       {
          this.contactRecList[event.target.accessKey].Phone=event.target.value;
       }
   }


   deletAction(event)
   {

    if(event.target.dataset.recordId)
    {
     this.deleteRecords.push(event.target.dataset.recordId);
    }

    if(this.contactRecList.length>=1)
    {
        this.contactRecList.splice(event.target.accessKey,1);
        this.keyIndex--;
    }
    console.log(event.target.dataset.recordId);
    console.log(this.contactRecList);

    }

    saveAction()
    {
       let finalConList=this.contactRecList.filter(con => con.LastName != ' ');
       console.log(finalConList);
       console.log(finalConList.length);

        addUpdateContact({payload:finalConList,deleteList:this.deleteRecords})
        .then(response=>{
            this.getData();
            console.log(response);
            this.closeModal;
            this.showToast('Success','Your Operation was successful!','SUCCESS');

        })
        .catch(error=>
            {
                 console.log(error.body.message);
                 this.showToast('Oops!','Something went Wrong!','Error');
            })
    }
    

   showToast(title,message,variant)
    {

    
         const event = new ShowToastEvent({
            title: title,
            message: message,
            variant:variant
      });
      this.dispatchEvent(event);
   }


   closeModal()
   {
       this.showModal=false;
   }


   handleAccountSelection(event){
    console.log("the selected record id is"+event.detail);
    this.contactRecList[event.target.accessKey].Bank__c=event.detail;
    console.log(this.contactRecList[event.target.accessKey])
}

       

}