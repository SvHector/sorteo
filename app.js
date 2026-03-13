
import { db } from "./firebase-config.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let datos=[];

const tabla=document.getElementById("tabla");
const total=document.getElementById("total");
const libres=document.getElementById("libres");
const ocupados=document.getElementById("ocupados");
const pagados=document.getElementById("pagados");
const buscar=document.getElementById("buscar");

const dbRef=ref(db,"rifa");

onValue(dbRef,(snapshot)=>{

const data=snapshot.val();
datos=[];

for(let key in data){
datos.push({
firebaseId:key,
...data[key]
});
}

renderizar(datos);
actualizarMetricas();

});

function renderizar(lista){

tabla.innerHTML="";

lista.forEach(n=>{

const tr=document.createElement("tr");

let estado="libre";
if(n.nombre) estado="ocupado";
if(n.pagado) estado="pagado";

tr.className=estado;

tr.innerHTML=`
<td>${n.numero}</td>

<td>
<input class="nombreInput"
data-id="${n.firebaseId}"
value="${n.nombre||""}">
</td>

<td>
<input class="telefonoInput"
data-id="${n.firebaseId}"
value="${n.telefono||""}">
</td>

<td>
<input type="checkbox" class="pagadoCheck"
data-id="${n.firebaseId}" ${n.pagado?"checked":""}>
</td>
`;

tabla.appendChild(tr);

});

}

document.addEventListener("blur",(e)=>{

if(e.target.classList.contains("nombreInput")){
update(ref(db,"rifa/"+e.target.dataset.id),{ nombre:e.target.value });
}

if(e.target.classList.contains("telefonoInput")){
update(ref(db,"rifa/"+e.target.dataset.id),{ telefono:e.target.value });
}

},true);

document.addEventListener("change",(e)=>{

if(e.target.classList.contains("pagadoCheck")){
update(ref(db,"rifa/"+e.target.dataset.id),{ pagado:e.target.checked });
}

});

function actualizarMetricas(){

total.innerText=datos.length;

let l=0,o=0,p=0;

datos.forEach(n=>{
if(!n.nombre) l++;
if(n.nombre) o++;
if(n.pagado) p++;
});

libres.innerText=l;
ocupados.innerText=o;
pagados.innerText=p;

}

window.filtrar=function(tipo){

let filtrados=[...datos];

if(tipo==="libres") filtrados=datos.filter(n=>!n.nombre);
if(tipo==="ocupados") filtrados=datos.filter(n=>n.nombre);
if(tipo==="pagados") filtrados=datos.filter(n=>n.pagado);

renderizar(filtrados);

}

buscar.addEventListener("input",()=>{

const t=buscar.value.toLowerCase();

const filtrados=datos.filter(n=>
(n.numero+"").includes(t) ||
(n.nombre||"").toLowerCase().includes(t)
);

renderizar(filtrados);

});

window.exportarCSV=function(){

let csv="Numero,Nombre,Telefono,Pagado\n";

datos.forEach(n=>{
csv+=`${n.numero},${n.nombre||""},${n.telefono||""},${n.pagado?"SI":"NO"}\n`;
});

const blob=new Blob([csv]);
const a=document.createElement("a");

a.href=URL.createObjectURL(blob);
a.download="rifa.csv";
a.click();

}

window.generarPDF=function(){

const { jsPDF } = window.jspdf;
const doc=new jsPDF();

const filas=datos.map(n=>[
n.numero,
n.nombre||"",
n.telefono||"",
n.pagado?"SI":"NO"
]);

doc.autoTable({
head:[["Numero","Nombre","Telefono","Pagado"]],
body:filas
});

doc.save("rifa.pdf");

}
