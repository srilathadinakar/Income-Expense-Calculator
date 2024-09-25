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

// getting data and Create table elements
 const createTable = (data) =>{    
    entries.innerHTML = "";   
    data.map((ele,y)=>{             
        return(
            entries.innerHTML +=`
                <tr id=${y} class="border border-b">                   
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.description}</td>
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.amount}</td>   
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.type}</td>                  
                    <td><button class="pl-10" onclick="editTask(${y})"><i class="material-symbols-rounded" style="color:green">Edit</i></button></td>
                    <td><button class="pl-10" onclick="deleteTask(${y})"><i class="material-symbols-rounded" style="color:red">Delete</i></button></td>          
                </tr>            
            `
        )       
    })
} 

//Update Income Expense details
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

//Enable Filter Functions
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

//Edit Data
const editTask = (index) => {
    const editedData = data[index];
    descriptionInput.value = editedData.description;
    amountInput.value = editedData.amount;
    document.querySelector(`input[value="${editedData.type}"]`).checked = true;
    data.splice(index, 1);
    localStorage.setItem("data",JSON.stringify(data));
    updateSummary();
    createTable(data);
};

// Delete Data
const deleteTask = (index) => {
    data.splice(index, 1);
    localStorage.setItem("data",JSON.stringify(data));
    updateSummary();
    createTable(data);
};

createTable(data);
updateSummary();