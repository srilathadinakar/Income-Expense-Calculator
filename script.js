// Getting all the HTML Elements
const form = document.getElementById("form");
const descriptionInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");

const entries = document.getElementById("entries");

const updIncome = document.getElementById("total-income");
const updExpense = document.getElementById("total-expense");
const updBalance = document.getElementById("net-balance");

const data = JSON.parse(localStorage.getItem("data")) || [];

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;       

    data.push({description,amount,type});

    resetForm();

    localStorage.setItem("data",JSON.stringify(data));

    createTable(data);
    updateSummary();
})

// getting data from getdata and create div in frontend
 const createTable = (data) =>{    
    entries.innerHTML = "";   
    data.map((ele,y)=>{             
        return(
            entries.innerHTML +=`
                <tr id=${y} class="border border-b">                   
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.description}</td>
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.amount}</td>   
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.type}</td>                  
                    <td><button class="edit pl-10" onclick="editTask(this)"><i class="material-symbols-rounded" style="color:green">Edit</i></button></td>
                    <td><button class="delete pl-10" onclick="deleteTask(this); createTable(data);"><i class="material-symbols-rounded" style="color:red">Delete</i></button></td>          
                </tr>            
            `
        )       
    })
    resetForm();
} 

 const updateSummary = () => {
    let totalIncome = data
        .filter((e) => e.type === "Income")
        .reduce((sum, curr) => sum + curr.amount, 0);      
        
    let totalExpense = data
        .filter((e) => e.type === "Expense")
        .reduce((sum, curr) => sum + curr.amount, 0);

    updIncome.innerText = `₹${totalIncome}`;
    updExpense.innerText = `₹${totalExpense}`;
    updBalance.innerText = `₹${totalIncome - totalExpense}`;
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;      
        let filteredEntries;
        if(filter === 'TypeIncome') {
            filteredEntries = data.filter((e) => e.type === "Income");                     
        }else if (filter === 'TypeExpense') {            
            filteredEntries = data.filter((e) => e.type === "Expense");                
        }else {
            filteredEntries = data;            
        }       
        createTable(filteredEntries);
    });
});

// reset the form
const resetForm = () =>{
    descriptionInput.value = "";
    amountInput.value = "";
}

//edit function
const editTask = (e) =>{
    let result = e.parentElement.parentElement;
    descriptionInput.value = result.children[0].innerHTML;
    amountInput.value = result.children[1].innerHTML;
    document.querySelector('input[name="type"]').value = result.children[2].innerHTML;    
    
    deleteTask(e);   
} 

const deleteTask = (e) =>{
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id,1);
    localStorage.setItem("data",JSON.stringify(data));
    updateSummary();
}

createTable(data);
updateSummary();
