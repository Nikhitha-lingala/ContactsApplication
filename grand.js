import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHyi8SSmEFUu8GKLp1TfiqR7mSxCnFfXw",
    authDomain: "login-example-c6d26.firebaseapp.com",
    projectId: "login-example-c6d26",
    storageBucket: "login-example-c6d26.appspot.com",
    messagingSenderId: "839963417327",
    appId: "1:839963417327:web:6b16e181863128d891991a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let aname = document.getElementById("aname");
let anumber = document.getElementById("anumber");
let aemail= document.getElementById("aemail");

let dname = document.getElementById("dname");

let uname = document.getElementById("uname");
let unumber = document.getElementById("unumber");
let uemail = document.getElementById("uemail");

let rname = document.getElementById("rname");

let addsubmit = document.getElementById("addsubmit");
let deletesubmit = document.getElementById("deletesubmit");
let updatesubmit = document.getElementById("updatesubmit");
let retrievesubmit = document.getElementById("retrievesubmit");
let retrieveallsubmit = document.getElementById("retrieveallsubmit");
const auth = getAuth(app);

let userSignedin=document.getElementById("userSignedin");


userSignedin.addEventListener("click",()=>{
    userSignedin.innerHTML=auth.currentUser.email;
})

const addData = () => {
    const contactsRef = ref(db, '/');
    get(contactsRef).then(snapshot => {
        const newData = snapshot.exists ? snapshot.val() : {};
        newData[aname.value] = {
            // cid:id.value,
            name: aname.value,
            number: anumber.value,
            email: aemail.value,
            userId: auth.currentUser.uid
        };
        set(contactsRef, newData)
            .then(() => {
                alert("Data added successfully");
                document.getElementById("aname").value="";
                document.getElementById("anumber").value="";
                document.getElementById("aemail").value="";
            }).catch(error => {
                alert("Unsuccessful adding data");
                console.error(error);
            })
    })

}

const retrieveData = () => {
    const contactsRef = ref(db, '/');
    const nameToRetrieve = rname.value;
    get(child(contactsRef, nameToRetrieve))
        .then(
            snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    document.getElementById('detail1').innerHTML = data.name;
                    document.getElementById('detail2').innerHTML = data.number;
                    document.getElementById('detail3').innerHTML = data.email;
                    document.getElementById("detailspopup").style.display="block";
                    
                } else {
                    alert("Name not found");
                }
            }
        )
        .catch(err => {
            alert("Error retrieving data");
            console.error(err);
        })
}

const modifyData = () => {
    const contactsRef = ref(db, '/');
    get(contactsRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const nameTomodify = uname.value;
                if (data[nameTomodify]) {
                    data[nameTomodify].name = uname.value;
        
                    if(unumber.value===""){
                        ;
                    }else{
                        data[nameTomodify].number = unumber.value;
                    }

                    if(uemail.value===""){
                        ;
                    }else{
                        data[nameTomodify].email=uemail.value;
                    }
                    data[nameTomodify].userId=auth.currentUser.uid;
                    set(contactsRef, data).then(() => {
                        alert("Data modified successfully");
                        document.getElementById("uname").value="";
                        document.getElementById("unumber").value="";
                        document.getElementById("uemail").value="";
                    }).catch(err => {
                        alert("Modifying data Unsuccessful");
                        console.error(err);
                    })
                } else {
                    alert("contact not modified");
                }
            } else {
                alert("No data found");
            }
        })
        .catch(err => {
            alert("Error retrieving contact");
            console.error(err);
        })
}
const deleteData = () => {
    const nameToDelete = dname.value;
    const contactsRef = ref(db, '/');
    const childRef = child(contactsRef, nameToDelete);
    get(childRef).then(snapshot => {
        if (snapshot.exists()) {
            remove(childRef).then(() => {
                alert("Contact deleted successfully");
                document.getElementById("dname").value="";
            }).catch(err => {
                alert("Error deleting contact");
                console.error(err);
            })
        } else {
            alert("Contact not found");
        }
    }).catch(err => {
        alert("Error retriving contact");
        console.error(err);
    });
}

const retrieveAllData = () => {
    const contactsRef = ref(db, '/');
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("No user logged in");
        return;
    }

    get(contactsRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                const contacts = snapshot.val();
                const myConts = [];

                for (const contactKey in contacts) {
                    const contact = contacts[contactKey];
                    if (contact.userId === currentUser.uid) {
                        myConts.push(contact);
                    }
                }

                if (myConts.length > 0) {
                    const modalContent = document.createElement('div');
                    modalContent.style.marginLeft= '140px';
                    modalContent.style.marginTop='50px';
                    modalContent.style.width = '80%';
                    modalContent.style.height = '80%';
                    modalContent.style.overflow = 'scroll';
                    modalContent.style.backgroundColor= 'rgba(255,250,250)';
                    
                    const closeButton = document.createElement('button');
                    closeButton.textContent = '+';
                    closeButton.style.transform='rotate(45deg)';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '50px';
                    closeButton.style.right = '140px';
                    closeButton.style.border = 'none';
                    closeButton.style.background = 'none';
                    closeButton.style.fontSize = '35px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.onclick = () => {
                        modal.style.display = 'none';
                    };
                   
                    const table = document.createElement('table');
                    table.style.borderTop = '1px solid black'; // Adding border
                    table.style.borderCollapse= 'collapse';
                    // table.style.marginTop = '20px';
                    table.innerHTML = `
                        <thead>
                            <tr class="hoverable">
                                <th style="border-bottom: 1px solid black; width:500px; height:40px;background-color:lavender; ">NAME</th>
                                <th style="border-bottom: 1px solid black; width:500px; height:40px;background-color:lavender;">NUMBER</th>
                                <th style="border-bottom: 1px solid black; width:500px; height:40px;background-color:lavender;">EMAIL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myConts.map(contact => `
                           
                                <tr class="hoverable">
                                    <td  style="border-bottom: 1px solid black; width:300px; padding-left:120px; height:42px; ">${contact.name}</td>
                                    <td style="border-bottom: 1px solid black; width:300px;padding-left:110px ;height:42px; ">${contact.number}</td>
                                    <td style="border-bottom: 1px solid black; width:300px;padding-left:130px ;height:25px;">${contact.email}</td>
                                </tr>
                            
                            `).join('')}
                        </tbody>
                    `;
                    
                    modalContent.appendChild(table);
                    modalContent.appendChild(closeButton);

                    const modal = document.createElement('div');
                    modal.style.display = 'block';
                    modal.style.position = 'fixed';
                    modal.style.zIndex = '1';
                    modal.style.left = '50';
                    modal.style.top = '0';
                    modal.style.width = '100%';
                    modal.style.height = '100%';
                    modal.style.overflow = 'auto';

                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);

                    const hoverableCells = document.querySelectorAll('.hoverable');
                    hoverableCells.forEach(cell => {
                        cell.addEventListener('mouseover', () => {
                            cell.style.backgroundColor = 'whitesmoke';
                        });
                        cell.addEventListener('mouseout', () => {
                            cell.style.backgroundColor = 'transparent';
                        });
                    });
                } else {
                    console.error("No contacts found");
                }
            } else {
                console.error("Contacts not found");
            }
        })
        .catch(err => {
            console.error("Error retrieving contacts:", err);
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error occurred during sign-out:', error);
        });
}

const logoutButton = document.getElementById('logoutpage'); // Assuming you have a logout button with id 'logoutButton'
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

addsubmit.addEventListener('click', addData);
retrievesubmit.addEventListener('click', retrieveData);
updatesubmit.addEventListener('click', modifyData);
deletesubmit.addEventListener('click', deleteData);
retrieveallsubmit.addEventListener('click', retrieveAllData);
