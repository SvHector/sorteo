
import { db } from "./firebase-config.js";

import {
ref,
onValue,
update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
id:key,
...data[key]
});

}

renderizar(datos);
metricas();

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
<input 
type="text"
value="${n.nombre ?? ''}"
class="admin-input"
data-id="${n.id}"
data-field="nombre">
</td>

<td>
<input 
type="text"
value="${n.telefono ?? ''}"
class="admin-input"
data-id="${n.id}"
data-field="telefono">
</td>

<td>
<input value="${n.telefono||""}"
onchange="guardarTelefono('${n.id}',this.value)">
</td>

<td>
<input type="checkbox" ${n.pagado?"checked":""}
onclick="togglePagado('${n.id}',this.checked)">
</td>

<td>
<button onclick="guardar('${n.id}')">Guardar</button>
</td>
`;

tabla.appendChild(tr);

});

}

window.guardarNombre=function(id,valor){

update(ref(db,"rifa/"+id),{
nombre:valor
});

}

window.guardarTelefono=function(id,valor){

update(ref(db,"rifa/"+id),{
telefono:valor
});

}

window.togglePagado=function(id,valor){

update(ref(db,"rifa/"+id),{
pagado:valor
});

}

window.guardar=function(){
alert("Guardado");
}

function metricas(){

total.innerText=datos.length;

let l=0;
let o=0;
let p=0;

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

if(tipo==="libres")
filtrados=datos.filter(n=>!n.nombre);

if(tipo==="ocupados")
filtrados=datos.filter(n=>n.nombre);

if(tipo==="pagados")
filtrados=datos.filter(n=>n.pagado);

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

const { jsPDF }=window.jspdf;

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
