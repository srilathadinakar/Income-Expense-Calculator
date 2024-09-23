// Getting all the HTML Elements
const form = document.getElementById("form");
const description = document.getElementById("desc");
const amount = document.getElementById("amount");

const category = document.getElementById("category");
const type = category.value;
const selected = document.getElementById("selected");

const msg = document.getElementById("msg");

const entries = document.getElementById("entries");
const add = document.getElementById("add");

const updIncome = document.getElementById("total-income");
const updExpense = document.getElementById("total-expense");
const updBalance = document.getElementById("net-balance");

const table = document.getElementById("table");

// Form Validation
const formValidation = () =>{
    if(description.value === "" || amount.value === ""){
        msg.innerHTML = "Please Enter the Fields";
    }
    else{
        msg.innerHTML = "";
        getData();
        add.setAttribute("data-modal-hide","static-modal");       
        add.click();
        (()=>{           
            add.setAttribute("data-modal-hide","")          
        })()
    }
}

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    formValidation();
})

// Getting data from form and store it in array of objects
let data = [{}];
const getData = () =>{
    data.push({
        category:category.value,
        description:description.value,
        amount:parseFloat(amount.value)
    })
    localStorage.setItem("data",JSON.stringify(data));   
    createTable(data);
    updateSummary();
}

// getting data from getdata and create div in frontend
const createTable = (data) =>{    
    entries.innerHTML = "";   
    data.map((ele,y)=>{             
        return(
            entries.innerHTML +=`
                <tr id="${y}" class="border border-b">
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.category}</td>
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.description}</td>
                    <td class="p-3 w-1/6 text-lg pl-5">${ele.amount}</td>                     
                    <td><button data-id="${y}" onclick="editTask(this);" class="edit pl-10" data-modal-target="static-modal" data-modal-toggle="static-modal"><i class="material-symbols-rounded" style="color:green">Edit</i></button></td>
                    <td><button class="delete pl-10" onclick="deleteTask(this); createTable(data);"><i class="material-symbols-rounded" style="color:red">Delete</i></button></td>          
                </tr>            
            `
        )       
    })
    resetForm();
}

const updateSummary = () => {
    let totalIncome = data
        .filter((e) => e.category === "Income")
        .reduce((sum, curr) => sum + curr.amount, 0);      
        
    let totalExpense = data
        .filter((e) => e.category === "Expense")
        .reduce((sum, curr) => sum + curr.amount, 0);

    updIncome.innerText = `₹${totalIncome}`;
    updExpense.innerText = `₹${totalExpense}`;
    updBalance.innerText = `₹${totalIncome - totalExpense}`;
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;      
        let filteredEntries;
        if(filter === 'Income') {
            filteredEntries = data.filter((e) => e.category === "Income");                     
        }else if (filter === 'Expense') {            
            filteredEntries = data.filter((e) => e.category === "Expense");                
        }else {
            filteredEntries = data;            
        }       
        createTable(filteredEntries);
    });
});

// reset the form
const resetForm = () =>{
    category.value = `${selected.value}`; 
    description.value = "";
    amount.value = "";
}

(()=>{
    data = JSON.parse(localStorage.getItem("data")) || [];
    createTable(data);
    updateSummary();
})()

//edit function
const editTask = (e) =>{
    let result = e.parentElement.parentElement;
    category.value = result.children[0].innerHTML;
    description.value = result.children[1].innerHTML;
    amount.value = result.children[2].innerHTML;

    deleteTask(e);   
}

const deleteTask = (e) =>{
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id,1);
    localStorage.setItem("data",JSON.stringify(data));
    updateSummary()  
}
